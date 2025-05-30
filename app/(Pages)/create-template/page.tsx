"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { container, success, failure } from "@/lib/toast.util";
import { useRouter } from "next/navigation";
import { Block } from "@/interfaces/interfaces";

export default function EmailBuilder() {
  const { user } = useUser();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const Router = useRouter();

  const addBlock = (type: Block["type"]) => {
    let defaultContent = "";
    switch (type) {
      case "text":
        defaultContent = "Hello {{name}},";
        break;
      case "heading":
        defaultContent = "🚀 New Opportunity at {{company}}";
        break;
      case "button":
        defaultContent = "Apply Now";
        break;
    }
    setBlocks([
      ...blocks,
      {
        id: uuidv4(),
        type,
        content: defaultContent,
        styles: {
          textAlign: "left",
          fontSize: "16px",
          color: "#000000",
          backgroundColor: "transparent",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
        },
      },
    ]);
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const updateBlockStyle = (
    id: string,
    field: keyof Block["styles"],
    value: string
  ) => {
    setBlocks(
      blocks.map((b) =>
        b.id === id ? { ...b, styles: { ...b.styles, [field]: value } } : b
      )
    );
  };

  const renderPreview = (block: Block) => {
    const content = block.content.replace(/{{(.*?)}}/g, (_, key) => {
      const trimmedKey = key.trim();
      return formData[trimmedKey] !== undefined
        ? formData[trimmedKey]
        : `{{${trimmedKey}}}`;
    });

    const style = {
      textAlign: block.styles.textAlign,
      fontSize: block.styles.fontSize,
      color: block.styles.color,
      backgroundColor: block.styles.backgroundColor,
      fontWeight: block.styles.fontWeight,
      fontStyle: block.styles.fontStyle,
      textDecoration: block.styles.textDecoration,
    } as React.CSSProperties;

    switch (block.type) {
      case "heading":
        return <h2 style={style}>{content}</h2>;
      case "button":
        return (
          <Button style={style} variant="outline">
            {content}
          </Button>
        );
      case "text":
      default:
        return <p style={style}>{content}</p>;
    }
  };

  const saveTemplate = async () => {
    if (!user?.id) {
      failure("You must be logged in to save templates", 2000);
      await new Promise((res) => setTimeout(res, 2500));
      Router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      const placeholders = extractPlaceholders(blocks);
      const { error } = await supabase.from("email_templates").insert([
        {
          user_id: user.id,
          name: templateName || `Template ${Date.now()}`,
          blocks,
          placeholders,
        },
      ]);

      if (error) throw error;
      success("Template saved successfully!", 2000);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      Router.push("/send/all-custom-templates");

      setFormData({
        candidateName: "Username Here",
        position: "Position Title",
        company: "Company Name",
        description: "Description of the company.",
      });
    } catch (error) {
      failure("Failed to save template", 2000);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const extractPlaceholders = (blocks: Block[]): string[] => {
    const placeholderSet = new Set<string>();
    blocks.forEach((block) => {
      const matches = block.content.match(/{{(.*?)}}/g);
      matches?.forEach((match) => {
        placeholderSet.add(match.replace(/[{}]/g, "").trim());
      });
    });
    return Array.from(placeholderSet);
  };

  const exportTemplate = () => {
    const jsx = blocks
      .map(
        (b) =>
          `// ${b.type}\n<${
            b.type === "text" ? "p" : b.type === "heading" ? "h2" : "Button"
          } style={{ textAlign: '${b.styles.textAlign}', fontSize: '${
            b.styles.fontSize
          }', color: '${b.styles.color}', backgroundColor: '${
            b.styles.backgroundColor
          }', fontWeight: '${b.styles.fontWeight}', fontStyle: '${
            b.styles.fontStyle
          }', textDecoration: '${b.styles.textDecoration}' }}>${
            b.content
          }</${b.type === "text" ? "p" : b.type === "heading" ? "h2" : "Button"}>`
      )
      .join("\n\n");
    const blob = new Blob([jsx], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName || "email-template"}.tsx`;
    a.click();
  };

  return (
    <div className="max-w-4xl py-8 flex flex-col items-center justify-center mx-auto">
      {container}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">📧 Email Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Block Add Buttons */}
          <div className="flex gap-2">
            <Button onClick={() => addBlock("heading")} variant="secondary">
              + Heading
            </Button>
            <Button onClick={() => addBlock("text")} variant="secondary">
              + Text
            </Button>
            <Button onClick={() => addBlock("button")} variant="secondary">
              + Button
            </Button>
          </div>

          {/* Blocks Editor */}
          <div className="space-y-4">
            {blocks.map((block) => (
              <Card key={block.id}>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label
                      htmlFor={`content-${block.id}`}
                      className="capitalize py-2"
                    >
                      {block.type} content
                    </Label>
                    <Textarea
                      id={`content-${block.id}`}
                      rows={2}
                      value={block.content}
                      onChange={(e) =>
                        updateBlockContent(block.id, e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Text Align",
                        type: "select",
                        field: "textAlign",
                        options: ["left", "center", "right"],
                      },
                      {
                        label: "Font Size",
                        type: "input",
                        field: "fontSize",
                        placeholder: "e.g., 16px",
                      },
                      {
                        label: "Text Color",
                        type: "color",
                        field: "color",
                      },
                      {
                        label: "Background Color",
                        type: "color",
                        field: "backgroundColor",
                      },
                      {
                        label: "Font Weight",
                        type: "select",
                        field: "fontWeight",
                        options: ["normal", "bold"],
                      },
                      {
                        label: "Font Style",
                        type: "select",
                        field: "fontStyle",
                        options: ["normal", "italic"],
                      },
                      {
                        label: "Text Decoration",
                        type: "select",
                        field: "textDecoration",
                        options: ["none", "underline"],
                      },
                    ].map(({ label, type, field, options, placeholder }) => (
                      <div key={field} className="space-y-2 ">
                        <Label>{label}</Label>
                        {type === "select" ? (
                          <Select
                            value={
                              block.styles[field as keyof Block["styles"]] ?? ""
                            }
                            onValueChange={(value: string) =>
                              updateBlockStyle(
                                block.id,
                                field as keyof Block["styles"],
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field}`} />
                            </SelectTrigger>
                            <SelectContent className="text-white dark:bg-black">
                              {options?.map((o) => (
                                <SelectItem key={o} value={o}>
                                  {o}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : type === "color" ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type={type}
                              value={
                                block.styles[field as keyof Block["styles"]] ??
                                ""
                              }
                              onChange={(e) =>
                                updateBlockStyle(
                                  block.id,
                                  field as keyof Block["styles"],
                                  e.target.value
                                )
                              }
                              className="w-full"
                            />

                            <div
                              className="w-8 h-8 border rounded"
                              style={{
                                backgroundColor:
                                  field === "color"
                                    ? block.styles.color
                                    : block.styles.backgroundColor,
                              }}
                            />
                          </div>
                        ) : (
                          <Input
                            type={type}
                            value={block.styles[field as keyof Block["styles"]]}
                            onChange={(e) =>
                              updateBlockStyle(
                                block.id,
                                field as keyof Block["styles"],
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-sm">
                    <Label>Preview:</Label>
                    <div className="mt-1 p-2 border rounded">
                      {renderPreview(block)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Placeholder Key-Value Manager */}
          <Card>
            <CardHeader>
              <CardTitle>🔧 Placeholder Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {`{{${key}}}`}
                    </span>
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newFormData = { ...formData };
                      delete newFormData[key];
                      setFormData(newFormData);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Placeholder key (e.g., candidateName)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <Button
                  size="icon"
                  onClick={() => {
                    if (newKey.trim()) {
                      setFormData((prev) => ({ ...prev, [newKey]: newValue }));
                      setNewKey("");
                      setNewValue("");
                    }
                  }}
                >
                  ➕
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save and Export */}
          <Card>
            <CardHeader>
              <CardTitle>Template Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={saveTemplate} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Template"}
                </Button>
                <Button onClick={exportTemplate} variant="outline">
                  Export JSX
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Final Preview */}
          <Card>
            <CardHeader>
              <CardTitle>🖼️ Final Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              {blocks.map((block) => (
                <div className="text-black dark:text-white" key={block.id}>
                  {renderPreview(block)}
                </div>
              ))}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
