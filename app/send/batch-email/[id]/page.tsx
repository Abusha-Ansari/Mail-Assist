"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Download, Plus, Minus, Send, Eye, Users, Mail, AlertCircle } from "lucide-react";
import { success, failure, container } from "@/lib/toast.util";
import { supabase } from "@/lib/supabaseClient";
import { deductCredits } from "@/utils/auth";
import { useUser } from "@/context/UserContext";
import { addUserMail, MailStatus } from "@/utils/userMail.utils";

export default function BatchEmailPage() {
  const { id: templateId } = useParams();

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [csvParseError, setCsvParseError] = useState<string>("");
  const { user } = useUser();

  // useEffect(() => {
  //   // Save the original theme
  //   originalTheme.current = theme;
    
  //   // Change to the desired theme (e.g., light)
  //   setTheme('light');

  //   return () => {
  //     // Restore the original theme
  //     if (originalTheme.current) {
  //       setTheme('dark');
  //     }
  //   };
  // }, [theme, setTheme]);

  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true);
      try {
        const { data: templateData, error } = await supabase
          .from("email_templates")
          .select("blocks, placeholders")
          .eq("id", templateId)
          .single();

        if (error || !templateData) {
          throw error || new Error("Template not found");
        }

        const placeholders: string[] = templateData.placeholders || [];
        setHeaders(["email", ...placeholders]);
        setRows([
          {
            email: "",
            ...Object.fromEntries(placeholders.map((p) => [p, ""])),
          },
        ]);
      } catch (error) {
        console.error("Failed to load template:", error);
        failure("Failed to load template", 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (templateId) fetchTemplate();
  }, [templateId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const csv = e.target.files?.[0];
    if (!csv) return;

    setCsvParseError("");
    setIsLoading(true);

    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const csvData = results.data as Record<string, string>[];
          const csvHeaders = results.meta?.fields || Object.keys(csvData[0] || {});
          
          // Validate that CSV has required headers
          const missingHeaders = headers.filter(header => 
            !csvHeaders.some(csvHeader => 
              csvHeader.toLowerCase().includes(header.toLowerCase()) || 
              header.toLowerCase().includes(csvHeader.toLowerCase())
            )
          );

          if (missingHeaders.length > 0) {
            setCsvParseError(`Missing or unmatched columns: ${missingHeaders.join(', ')}. Please ensure your CSV has columns that match the required placeholders.`);
            setIsLoading(false);
            return;
          }

          // Map CSV data to our template structure
          const mappedRows = csvData.map(csvRow => {
            const mappedRow: Record<string, string> = {};
            
            headers.forEach(requiredHeader => {
              // Try to find matching CSV column
              const matchingCsvHeader = csvHeaders.find(csvHeader => 
                csvHeader.toLowerCase().includes(requiredHeader.toLowerCase()) || 
                requiredHeader.toLowerCase().includes(csvHeader.toLowerCase()) ||
                csvHeader.toLowerCase() === requiredHeader.toLowerCase()
              );
              
              mappedRow[requiredHeader] = matchingCsvHeader ? (csvRow[matchingCsvHeader] || '') : '';
            });
            
            return mappedRow;
          });

          setRows(mappedRows);
          setCsvParseError("");
          success(`Successfully imported ${mappedRows.length} recipients`, 2000);
        } catch {
          setCsvParseError("Failed to parse CSV file. Please ensure it is formatted correctly.");
          failure("Failed to parse CSV file. Please ensure it is formatted correctly.", 2000);
        } finally {
          setIsLoading(false);
        }
      },
      error: () => {
        setCsvParseError("Failed to parse CSV file. Please ensure it is formatted correctly.");
        failure("Failed to parse CSV file. Please ensure it is formatted correctly.", 2000);
        setIsLoading(false);
      },
    });
  };

  const previewEmails = async () => {
    if (!rows.length) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/send-batch/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, rows }),
      });

      const data = await res.json();
      if (res.ok) {
        setPreviews(data.previews);
        setActiveTab("preview");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      failure(
        `Failed to preview emails: ${error instanceof Error ? error.message : "Unknown error"}`,
        2000
      );
    } finally {
      setIsLoading(false);
    }
  };

 const sendEmails = async () => {
  if (!subject.trim()) {
    failure("Please enter an email subject.", 2000);
    return;
  }

  if (!confirm(`Are you sure you want to send ${rows.length} emails?`)) {
    return;
  }

  setIsLoading(true);

  try {
    if (rows.length === 0) {
      failure("No recipients to send emails to.", 2000);
      return;
    }

    try {
      await deductCredits(user!.id, rows.length * 10);
    } catch {
      failure("Not enough credits to send email", 2000);
      return;
    }

    const res = await fetch("/api/send-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, rows, subject }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Emails sent successfully:", data);

      const htmls = data.renderedHtmls || [];

      // Use the same rows (you originally sent)
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const html = htmls[i];

        const mailData = {
          userId: user!.id,
          mailId: `${Date.now()}_${i}`, // fallback ID
          status: "send" as MailStatus,
          to_email: row.email,
          subject,
          html,
        };

        console.log(`Saving email data for ${i}:`, mailData);

        try {
          await addUserMail(mailData);
        } catch (err) {
          console.error(`Failed to save email ${i}:`, err);
        }
      }

      success(`Successfully sent ${rows.length} emails!`, 2000);
    } else {
      throw new Error(data?.message || "Failed to send emails.");
    }
  } catch (error) {
    failure(
      `Failed to send emails: ${error instanceof Error ? error.message : "Unknown error"}`,
      2000
    );
  } finally {
    setIsLoading(false);
  }
};



  const downloadSampleCSV = () => {
    const csvContent = [
      headers.join(','),
      headers.map(header => {
        switch(header) {
          case 'email': return 'john@example.com';
          case 'firstName': return 'John';
          case 'lastName': return 'Doe';
          case 'company': return 'Example Corp';
          case 'position': return 'Manager';
          default: return `sample_${header}`;
        }
      }).join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadCurrentCSV = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "batch-emails.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/30 relative overflow-hidden">
      {container}
      
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}} />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 pt-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mb-6 shadow-xl animate-scale-in relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 animate-pulse" />
              <Mail className="h-8 w-8 text-primary relative z-10" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20 blur-2xl -z-10 animate-pulse" />
          </div>
          
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent relative z-10 animate-slide-in-right">
              Batch Email Sender
            </h1>
            <p className="text-lg text-muted-foreground mt-2 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              Send personalized emails to multiple recipients at once
            </p>
          </div>
        </div>

        {/* Enhanced Email Configuration Card */}
        <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-2xl animate-scale-in" style={{animationDelay: '0.3s'}}>
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/50 border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary rounded-lg flex items-center justify-center">
                <Send className="h-4 w-4 text-primary-foreground" />
              </div>
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground font-medium">Email Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter your email subject here..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-background/80 backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-foreground font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Recipients Data (CSV File)
              </Label>
              
              {/* Required columns info */}
              {headers.length > 0 && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">Required CSV Columns:</h4>
                  <div className="flex flex-wrap gap-2">
                    {headers.map(header => (
                      <span key={header} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                        {header}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="max-w-md border-border/50 focus:border-primary/50 bg-background/80 backdrop-blur-sm"
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-muted to-muted rounded-lg border border-border/50">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {rows.length} {rows.length === 1 ? "recipient" : "recipients"}
                  </span>
                </div>
              </div>

              {/* CSV Parse Error */}
              {csvParseError && (
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">CSV Import Error</h4>
                    <p className="text-destructive/80 text-sm mt-1">{csvParseError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  setRows([
                    ...rows,
                    Object.fromEntries(headers.map((h) => [h, ""])),
                  ])
                }
                disabled={isLoading}
                variant="outline"
                className="group bg-background/80 hover:bg-primary/5 border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Add Row
              </Button>
              <Button
                onClick={() => setRows(rows.slice(0, -1))}
                disabled={rows.length === 0 || isLoading}
                variant="outline"
                className="group bg-background/80 hover:bg-destructive/5 border-border/50 hover:border-destructive/50 transition-all duration-300"
              >
                <Minus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Remove Last Row
              </Button>
              <Button
                onClick={downloadCurrentCSV}
                variant="outline"
                disabled={isLoading || rows.length === 0}
                className="group bg-background/80 hover:bg-accent border-border/50 hover:border-accent/50 transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Download CSV
              </Button>
              <Button
                onClick={downloadSampleCSV}
                variant="outline"
                disabled={isLoading}
                className="group bg-background/80 hover:bg-primary/5 border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Sample CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Management Card */}
        <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-2xl animate-scale-in" style={{animationDelay: '0.4s'}}>
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/50 border-b border-border/50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-background/60 backdrop-blur-sm">
                <TabsTrigger 
                  value="edit" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span>Edit Data</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  disabled={previews.length === 0}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>Previews ({previews.length})</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab}>
              <TabsContent value="edit" className="space-y-4">
                <div className="rounded-xl border border-border/50 overflow-hidden bg-background/60 backdrop-blur-sm shadow-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-muted to-muted/50">
                        {headers.map((header) => (
                          <th key={header} className="font-semibold text-foreground capitalize p-3 text-left border-b border-border/50">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-primary/5 transition-colors duration-200 border-b border-border/30">
                          {headers.map((header) => (
                            <td key={header} className="p-2">
                              <Input
                                type="text"
                                value={row[header] || ""}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[rowIndex][header] = e.target.value;
                                  setRows(updatedRows);
                                }}
                                className="border-none focus:ring-2 focus:ring-primary/30 bg-transparent transition-all duration-200"
                                disabled={isLoading}
                                placeholder={`Enter ${header}...`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="space-y-4">
                <div className="space-y-6">
                  {previews.map((html, i) => (
                    <Card key={i} className="bg-background/80 backdrop-blur-sm border-border/50 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/50">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">
                            {i + 1}
                          </div>
                          Email Preview #{i + 1}
                        </h3>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div
                          className="prose max-w-none bg-card p-6 rounded-lg border border-border/50 shadow-sm"
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col justify-end md:flex-row gap-3 p-6 bg-gradient-to-r from-muted/50 to-muted/50 border-t border-border/50">
            <Button
              onClick={previewEmails}
              disabled={!rows.length || isLoading}
              variant="outline"
              className="group bg-background/80 hover:bg-primary/5 border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              {isLoading ? "Loading..." : "Preview Emails"}
            </Button>
            <Button
              onClick={sendEmails}
              disabled={!rows.length || isLoading}
              className="group relative bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            >
              <div className="relative flex items-center gap-2 z-10">
                <Send className="h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                <span>
                  {isLoading ? "Sending..." : `Send ${rows.length} Emails (${rows.length * 10} credits)`}
                </span>
              </div>
              
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover:translate-x-full" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}