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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { success, failure, container } from "@/lib/toast.util";
import { deductCredits } from "@/utils/auth";
import { useUser } from "@/context/UserContext";

export default function BatchEmailPage() {
  const { id: templateId } = useParams();

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const { user } = useUser();

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
        alert("Failed to load template");
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
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data as Record<string, string>[]);
        setIsLoading(false);
      },
      error: () => {
        failure(
          "Failed to parse CSV file. Please ensure it is formatted correctly.",
          2000
        );
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
        success(`Successfully sent ${rows.length} emails!`, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      failure(
        `Failed to Send emails: ${error instanceof Error ? error.message : "Unknown error"}`,
        2000
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {container}
      <Card>
        <CardHeader>
          <CardTitle>Batch Email Sender</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Enter Email Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Recipients Data (Upload a CSV file with all the placeholders
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="max-w-md"
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">
                {rows.length} {rows.length === 1 ? "recipient" : "recipients"}{" "}
                loaded
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                setRows([
                  ...rows,
                  Object.fromEntries(headers.map((h) => [h, ""])),
                ])
              }
              disabled={isLoading}
            >
              Add Row
            </Button>
            <Button
              onClick={() => setRows(rows.slice(0, -1))}
              disabled={rows.length === 0 || isLoading}
              variant="outline"
            >
              Remove Last Row
            </Button>
            <Button
              onClick={() => {
                const csv = Papa.unparse(rows);
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "batch-emails.csv";
                link.click();
              }}
              variant="outline"
              disabled={isLoading}
            >
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="edit">Edit Data</TabsTrigger>
              <TabsTrigger value="preview" disabled={previews.length === 0}>
                Previews ({previews.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab}>
            <TabsContent value="edit">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {headers.map((header) => (
                          <TableCell key={header}>
                            <Input
                              type="text"
                              value={row[header] || ""}
                              onChange={(e) => {
                                const updatedRows = [...rows];
                                updatedRows[rowIndex][header] = e.target.value;
                                setRows(updatedRows);
                              }}
                              className="border-none focus:ring-1"
                              disabled={isLoading}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <div className="space-y-4">
                {previews.map((html, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <h3 className="font-medium">Preview #{i + 1}</h3>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose max-w-none bg-white p-4 rounded border"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            onClick={previewEmails}
            disabled={!rows.length || isLoading}
            variant="outline"
          >
            {isLoading ? "Loading..." : "Preview Emails"}
          </Button>
          <Button
            onClick={sendEmails}
            disabled={!rows.length || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Sending..." : `Send ${rows.length} Emails (${rows.length*10} credits)`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
