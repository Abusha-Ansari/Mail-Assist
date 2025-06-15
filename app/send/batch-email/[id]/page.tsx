// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Papa from "papaparse";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { supabase } from "@/lib/supabaseClient";
// import { success, failure, container } from "@/lib/toast.util";
// import { deductCredits } from "@/utils/auth";
// import { useUser } from "@/context/UserContext";

// export default function BatchEmailPage() {
//   const { id: templateId } = useParams();

//   const [headers, setHeaders] = useState<string[]>([]);
//   const [rows, setRows] = useState<Record<string, string>[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [subject, setSubject] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("edit");
//   const { user } = useUser();

//   useEffect(() => {
//     const fetchTemplate = async () => {
//       setIsLoading(true);
//       try {
//         const { data: templateData, error } = await supabase
//           .from("email_templates")
//           .select("blocks, placeholders")
//           .eq("id", templateId)
//           .single();

//         if (error || !templateData) {
//           throw error || new Error("Template not found");
//         }

//         const placeholders: string[] = templateData.placeholders || [];
//         setHeaders(["email", ...placeholders]);
//         setRows([
//           {
//             email: "",
//             ...Object.fromEntries(placeholders.map((p) => [p, ""])),
//           },
//         ]);
//       } catch (error) {
//         console.error("Failed to load template:", error);
//         alert("Failed to load template");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (templateId) fetchTemplate();
//   }, [templateId]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const csv = e.target.files?.[0];
//     if (!csv) return;

//     setIsLoading(true);
//     Papa.parse(csv, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         setRows(results.data as Record<string, string>[]);
//         setIsLoading(false);
//       },
//       error: () => {
//         failure(
//           "Failed to parse CSV file. Please ensure it is formatted correctly.",
//           2000
//         );
//         setIsLoading(false);
//       },
//     });
//   };

//   const previewEmails = async () => {
//     if (!rows.length) return;

//     setIsLoading(true);
//     try {
//       const res = await fetch("/api/send-batch/preview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ templateId, rows }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setPreviews(data.previews);
//         setActiveTab("preview");
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       failure(
//         `Failed to preview emails: ${error instanceof Error ? error.message : "Unknown error"}`,
//         2000
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sendEmails = async () => {
//     if (!subject.trim()) {
//       failure("Please enter an email subject.", 2000);
//       return;
//     }

//     if (!confirm(`Are you sure you want to send ${rows.length} emails?`)) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       if (rows.length === 0) {
//         failure("No recipients to send emails to.", 2000);
//         return;
//       }
//       try {
//         await deductCredits(user!.id, rows.length * 10);
//       } catch {
//         failure("Not enough credits to send email", 2000);
//         return;
//       }
//       const res = await fetch("/api/send-batch", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ templateId, rows, subject }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         success(`Successfully sent ${rows.length} emails!`, 2000);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       failure(
//         `Failed to Send emails: ${error instanceof Error ? error.message : "Unknown error"}`,
//         2000
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-6">
//       {container}
//       <Card>
//         <CardHeader>
//           <CardTitle>Batch Email Sender</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="subject">Email Subject</Label>
//             <Input
//               id="subject"
//               type="text"
//               placeholder="Enter Email Subject"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>
//               Recipients Data (Upload a CSV file with all the placeholders
//             </Label>
//             <div className="flex items-center gap-2">
//               <Input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileChange}
//                 className="max-w-md"
//                 disabled={isLoading}
//               />
//               <span className="text-sm text-muted-foreground">
//                 {rows.length} {rows.length === 1 ? "recipient" : "recipients"}{" "}
//                 loaded
//               </span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <Button
//               onClick={() =>
//                 setRows([
//                   ...rows,
//                   Object.fromEntries(headers.map((h) => [h, ""])),
//                 ])
//               }
//               disabled={isLoading}
//             >
//               Add Row
//             </Button>
//             <Button
//               onClick={() => setRows(rows.slice(0, -1))}
//               disabled={rows.length === 0 || isLoading}
//               variant="outline"
//             >
//               Remove Last Row
//             </Button>
//             <Button
//               onClick={() => {
//                 const csv = Papa.unparse(rows);
//                 const blob = new Blob([csv], {
//                   type: "text/csv;charset=utf-8;",
//                 });
//                 const link = document.createElement("a");
//                 link.href = URL.createObjectURL(blob);
//                 link.download = "batch-emails.csv";
//                 link.click();
//               }}
//               variant="outline"
//               disabled={isLoading}
//             >
//               Download CSV
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList>
//               <TabsTrigger value="edit">Edit Data</TabsTrigger>
//               <TabsTrigger value="preview" disabled={previews.length === 0}>
//                 Previews ({previews.length})
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab}>
//             <TabsContent value="edit">
//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       {headers.map((header) => (
//                         <TableHead key={header}>{header}</TableHead>
//                       ))}
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {rows.map((row, rowIndex) => (
//                       <TableRow key={rowIndex}>
//                         {headers.map((header) => (
//                           <TableCell key={header}>
//                             <Input
//                               type="text"
//                               value={row[header] || ""}
//                               onChange={(e) => {
//                                 const updatedRows = [...rows];
//                                 updatedRows[rowIndex][header] = e.target.value;
//                                 setRows(updatedRows);
//                               }}
//                               className="border-none focus:ring-1"
//                               disabled={isLoading}
//                             />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </TabsContent>
//             <TabsContent value="preview">
//               <div className="space-y-4">
//                 {previews.map((html, i) => (
//                   <Card key={i}>
//                     <CardHeader>
//                       <h3 className="font-medium">Preview #{i + 1}</h3>
//                     </CardHeader>
//                     <CardContent>
//                       <div
//                         className="prose max-w-none bg-white p-4 rounded border"
//                         dangerouslySetInnerHTML={{ __html: html }}
//                       />
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//         <CardFooter className="flex justify-end gap-2">
//           <Button
//             onClick={previewEmails}
//             disabled={!rows.length || isLoading}
//             variant="outline"
//           >
//             {isLoading ? "Loading..." : "Preview Emails"}
//           </Button>
//           <Button
//             onClick={sendEmails}
//             disabled={!rows.length || isLoading}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             {isLoading ? "Sending..." : `Send ${rows.length} Emails (${rows.length*10} credits)`}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }





//* fix/match the working using above code snippet

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Download, Plus, Minus, Send, Eye, Users, Mail } from "lucide-react";
import { container, success, failure } from "@/lib/toast.util";
import { useTheme } from "next-themes";

export default function BatchEmailPage() {
  const { id: templateId } = useParams();

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const { theme, setTheme } = useTheme()
  const originalTheme = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Save the original theme
    originalTheme.current = theme
    
    // Change to the desired theme (e.g., dark)
    setTheme('light')

    return () => {
      // Restore the original theme
      if (originalTheme.current) {
        setTheme('dark')
      }
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true);
      try {
        // Mock template data for demo
        const placeholders = ["firstName", "lastName", "company"];
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

    setIsLoading(true);
    // Mock CSV parsing for demo
    setTimeout(() => {
      setRows([
        { email: "john@example.com", firstName: "John", lastName: "Doe", company: "Acme Inc" },
        { email: "jane@example.com", firstName: "Jane", lastName: "Smith", company: "Tech Corp" },
      ]);
      setIsLoading(false);
      success("CSV file parsed successfully", 2000);
    }, 1000);
  };

  const previewEmails = async () => {
    if (!rows.length) return;

    setIsLoading(true);
    try {
      // Mock preview generation
      setTimeout(() => {
        setPreviews(rows.map((_, i) => `<h1>Email Preview ${i + 1}</h1><p>This is a mock preview.</p>`));
        setActiveTab("preview");
        setIsLoading(false);
        success("Email previews generated", 2000);
      }, 1000);
    } catch {
      failure("Failed to preview emails", 2000);
      setIsLoading(false);
    }
  };

  const sendEmails = async () => {
    if (!subject.trim()) {
      failure("Please enter an email subject", 2000);
      return;
    }

    if (!confirm(`Are you sure you want to send ${rows.length} emails?`)) {
      return;
    }

    setIsLoading(true);
    try {
      // Mock email sending
      setTimeout(() => {
        success(`Successfully sent ${rows.length} emails!`, 2000);
        setIsLoading(false);
      }, 2000);
    } catch {
      failure("Failed to send emails", 2000);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {container}
      
      {/* Background decorations */}
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}} />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 pt-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-xl animate-scale-in relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse" />
              <Mail className="h-8 w-8 text-purple-500 relative z-10" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl -z-10 animate-pulse" />
          </div>
          
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent relative z-10 animate-slide-in-right">
              Batch Email Sender
            </h1>
            <p className="text-lg text-slate-600 mt-2 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              Send personalized emails to multiple recipients at once
            </p>
          </div>
        </div>

        {/* Enhanced Email Configuration Card */}
        <Card className="backdrop-blur-sm bg-white/90 border-slate-200/50 shadow-2xl animate-scale-in" style={{animationDelay: '0.3s'}}>
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-slate-200/50">
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Send className="h-4 w-4 text-white" />
              </div>
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-slate-700 font-medium">Email Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter your email subject here..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-slate-300/50 focus:border-blue-500/50 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-slate-700 font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Recipients Data (CSV File)
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="max-w-md border-slate-300/50 focus:border-blue-500/50 bg-white/80 backdrop-blur-sm"
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-slate-200/50">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {rows.length} {rows.length === 1 ? "recipient" : "recipients"}
                  </span>
                </div>
              </div>
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
                className="group bg-white/80 hover:bg-blue-50 border-slate-300/50 hover:border-blue-400/50 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Add Row
              </Button>
              <Button
                onClick={() => setRows(rows.slice(0, -1))}
                disabled={rows.length === 0 || isLoading}
                variant="outline"
                className="group bg-white/80 hover:bg-red-50 border-slate-300/50 hover:border-red-400/50 transition-all duration-300"
              >
                <Minus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Remove Last Row
              </Button>
              <Button
                onClick={() => {
                  // Mock CSV download
                  success("CSV file download initiated", 2000);
                }}
                variant="outline"
                disabled={isLoading}
                className="group bg-white/80 hover:bg-green-50 border-slate-300/50 hover:border-green-400/50 transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Management Card */}
        <Card className="backdrop-blur-sm bg-white/90 border-slate-200/50 shadow-2xl animate-scale-in" style={{animationDelay: '0.4s'}}>
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-slate-200/50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm">
                <TabsTrigger 
                  value="edit" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span>Edit Data</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  disabled={previews.length === 0}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
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
                <div className="rounded-xl border border-slate-200/50 overflow-hidden bg-white/60 backdrop-blur-sm shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                        {headers.map((header) => (
                          <TableHead key={header} className="font-semibold text-slate-700 capitalize">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-blue-50/50 transition-colors duration-200">
                          {headers.map((header) => (
                            <TableCell key={header} className="p-2">
                              <Input
                                type="text"
                                value={row[header] || ""}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[rowIndex][header] = e.target.value;
                                  setRows(updatedRows);
                                }}
                                className="border-none focus:ring-2 focus:ring-blue-400/30 bg-transparent transition-all duration-200"
                                disabled={isLoading}
                                placeholder={`Enter ${header}...`}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="space-y-4">
                <div className="space-y-6">
                  {previews.map((html, i) => (
                    <Card key={i} className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                            {i + 1}
                          </div>
                          Email Preview #{i + 1}
                        </h3>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div
                          className="prose max-w-none bg-white p-6 rounded-lg border border-slate-200/50 shadow-sm"
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col justify-end md:flex-row gap-3 p-6 bg-gradient-to-r from-slate-50/50 to-slate-100/50 border-t border-slate-200/50">
            <Button
              onClick={previewEmails}
              disabled={!rows.length || isLoading}
              variant="outline"
              className="group bg-white/80 hover:bg-blue-50 border-slate-300/50 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              {isLoading ? "Loading..." : "Preview Emails"}
            </Button>
            <Button
              onClick={sendEmails}
              disabled={!rows.length || isLoading}
              className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            >
              <div className="relative flex items-center gap-2 z-10">
                <Send className="h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                <span>
                  {isLoading ? "Sending..." : `Send ${rows.length} Emails (${rows.length * 10} credits)`}
                </span>
              </div>
              
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover:translate-x-full" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
