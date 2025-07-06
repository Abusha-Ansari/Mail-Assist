"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Trash2, 
  Edit, 
  Eye, 
  Plus,
  Type,
  Heading1,
  MousePointer,
  Palette,
  Settings,
  Download,
  Mail
} from "lucide-react";
import { container, success, failure } from "@/lib/toast.util";
// import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Block {
  id: string;
  type: "text" | "heading" | "button";
  content: string;
  styles: {
    textAlign: "left" | "center" | "right";
    fontSize: string;
    color: string;
    backgroundColor: string;
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    textDecoration: "none" | "underline";
  };
}

export default function EmailBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "John Doe",
    company: "TechCorp",
    position: "Software Engineer"
  });
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // const { theme, setTheme } = useTheme();
  // const originalTheme = useRef<string | undefined>(undefined)

  const { user } = useUser();
  const Router = useRouter();

  // useEffect(() => {
  //   // Save the original theme
  //   originalTheme.current = theme
    
  //   // Change to the desired theme (e.g., dark)
  //   setTheme('light')

  //   return () => {
  //     // Restore the original theme
  //     if (originalTheme.current) {
  //       setTheme("dark")
  //     }
  //   }
  // }, [theme,setTheme]);

  const addBlock = (type: Block["type"]) => {
    let defaultContent = "";
    switch (type) {
      case "text":
        defaultContent = "Hello {{name}}, we're excited to share this opportunity with you.";
        break;
      case "heading":
        defaultContent = "🚀 New Opportunity at {{company}}";
        break;
      case "button":
        defaultContent = "Apply Now";
        break;
    }
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: defaultContent,
      styles: {
        textAlign: "left" as const,
        fontSize: type === "heading" ? "24px" : type === "button" ? "16px" : "16px",
        color: type === "button" ? "#ffffff" : "#000000",
        backgroundColor: type === "button" ? "#3b82f6" : "transparent",
        fontWeight: type === "heading" ? "bold" : "normal",
        fontStyle: "normal" as const,
        textDecoration: "none" as const,
      },
    };
    setBlocks([...blocks, newBlock]);
    success(`${type.charAt(0).toUpperCase() + type.slice(1)} block has been added to your template.`,2000)
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    success("Block has been deleted from your template.", 2000);
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
      padding: block.type === "button" ? "12px 24px" : "8px 0",
      borderRadius: block.type === "button" ? "6px" : "0",
      border: "none",
      cursor: block.type === "button" ? "pointer" : "default",
      display: block.type === "button" ? "inline-block" : "block",
    } as React.CSSProperties;

    switch (block.type) {
      case "heading":
        return <h2 style={style} className="animate-fade-in">{content}</h2>;
      case "button":
        return (
          <button style={style} className="animate-scale-in hover-scale transition-all duration-200">
            {content}
          </button>
        );
      case "text":
      default:
        return <p style={style} className="animate-fade-in">{content}</p>;
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

  const exportTemplate = () => {
    const jsx = blocks
      .map(
        (b) =>
          `// ${b.type}\n<${
            b.type === "text" ? "p" : b.type === "heading" ? "h2" : "button"
          } style={{ textAlign: '${b.styles.textAlign}', fontSize: '${
            b.styles.fontSize
          }', color: '${b.styles.color}', backgroundColor: '${
            b.styles.backgroundColor
          }', fontWeight: '${b.styles.fontWeight}', fontStyle: '${
            b.styles.fontStyle
          }', textDecoration: '${b.styles.textDecoration}' }}>${
            b.content
          }</${b.type === "text" ? "p" : b.type === "heading" ? "h2" : "button"}>`
      )
      .join("\n\n");
    const blob = new Blob([jsx], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName || "email-template"}.tsx`;
    a.click();
    success(`Template "${templateName || "email-template"}" has been exported successfully.`, 2000) 
  };

  const getBlockIcon = (type: Block["type"]) => {
    switch (type) {
      case "heading":
        return <Heading1 className="w-4 h-4" />;
      case "text":
        return <Type className="w-4 h-4" />;
      case "button":
        return <MousePointer className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 overflow-hidden">
      {container}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl text-primary-foreground">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Email Builder</h1>
              <p className="text-muted-foreground">Create beautiful email templates with ease</p>
            </div>
          </div>
          
          {/* Template Name and Save Actions */}
          <div className="flex flex-col items-center gap-4 md:flex-row animate-slide-in-right">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter template name..."
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-64 bg-card/80 backdrop-blur-sm border-border focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={exportTemplate} variant="outline" className="gap-2 bg-card/80 backdrop-blur-sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                onClick={saveTemplate} 
                disabled={isSaving}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Block Management */}
          <div className="xl:col-span-2 space-y-6">
            {/* Add Blocks Section */}
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg animate-scale-in">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Plus className="w-5 h-5 text-primary" />
                  Add Content Blocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3">
                  <Button 
                    onClick={() => addBlock("heading")} 
                    variant="outline"
                    className="gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10 transition-all duration-200 hover-scale"
                  >
                    <Heading1 className="w-4 h-4 text-primary" />
                    Heading
                  </Button>
                  <Button 
                    onClick={() => addBlock("text")} 
                    variant="outline"
                    className="gap-2 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 hover:from-accent/20 hover:to-accent/10 transition-all duration-200 hover-scale"
                  >
                    <Type className="w-4 h-4 text-accent-foreground" />
                    Text
                  </Button>
                  <Button 
                    onClick={() => addBlock("button")} 
                    variant="outline"
                    className="gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10 transition-all duration-200 hover-scale"
                  >
                    <MousePointer className="w-4 h-4 text-primary" />
                    Button
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blocks Editor */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <Card key={block.id} className="bg-card/90 backdrop-blur-sm border-border shadow-lg animate-fade-in hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getBlockIcon(block.type)}
                        <Badge variant="secondary" className="capitalize">
                          {block.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Block {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBlock(block.id)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Content Editor */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-foreground">
                        <Edit className="w-4 h-4" />
                        Content
                      </Label>
                      <Textarea
                        rows={3}
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        className="bg-muted border-border focus:border-primary transition-colors resize-none"
                        placeholder={`Enter your ${block.type} content...`}
                      />
                    </div>

                    {/* Style Controls */}
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-foreground">
                        <Palette className="w-4 h-4" />
                        Styling Options
                      </Label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            label: "Alignment",
                            type: "select",
                            field: "textAlign",
                            options: [
                              { value: "left", label: "Left" },
                              { value: "center", label: "Center" },
                              { value: "right", label: "Right" }
                            ],
                          },
                          {
                            label: "Font Size",
                            type: "input",
                            field: "fontSize",
                            placeholder: "16px",
                          },
                          {
                            label: "Text Color",
                            type: "color",
                            field: "color",
                          },
                          {
                            label: "Background",
                            type: "color",
                            field: "backgroundColor",
                          },
                          {
                            label: "Weight",
                            type: "select",
                            field: "fontWeight",
                            options: [
                              { value: "normal", label: "Normal" },
                              { value: "bold", label: "Bold" }
                            ],
                          },
                          {
                            label: "Style",
                            type: "select",
                            field: "fontStyle",
                            options: [
                              { value: "normal", label: "Normal" },
                              { value: "italic", label: "Italic" }
                            ],
                          },
                        ].map(({ label, type, field, options, placeholder }) => (
                          <div key={field} className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
                            {type === "select" ? (
                              <Select
                                value={block.styles[field as keyof Block["styles"]] ?? ""}
                                onValueChange={(value: string) =>
                                  updateBlockStyle(block.id, field as keyof Block["styles"], value)
                                }
                              >
                                <SelectTrigger className="h-9 bg-muted border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                  {options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : type === "color" ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="color"
                                  value={block.styles[field as keyof Block["styles"]] ?? ""}
                                  onChange={(e) =>
                                    updateBlockStyle(block.id, field as keyof Block["styles"], e.target.value)
                                  }
                                  className="w-12 h-9 p-1 bg-muted border-border"
                                />
                                <Input
                                  type="text"
                                  value={block.styles[field as keyof Block["styles"]] ?? ""}
                                  onChange={(e) =>
                                    updateBlockStyle(block.id, field as keyof Block["styles"], e.target.value)
                                  }
                                  className="flex-1 h-9 bg-muted border-border font-mono text-sm"
                                />
                              </div>
                            ) : (
                              <Input
                                type="text"
                                value={block.styles[field as keyof Block["styles"]] ?? ""}
                                onChange={(e) =>
                                  updateBlockStyle(block.id, field as keyof Block["styles"], e.target.value)
                                }
                                placeholder={placeholder}
                                className="h-9 bg-muted border-border"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Block Preview */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-foreground">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Label>
                      <div className="p-4 bg-gradient-to-br from-muted to-card border border-border rounded-lg">
                        {renderPreview(block)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Placeholders and Final Preview */}
          <div className="space-y-6">
            {/* Placeholder Manager */}
            <Card className="bg-card/90 backdrop-blur-sm border-border shadow-lg animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Settings className="w-5 h-5 text-primary" />
                  Placeholder Values
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs">
                        {`{{${key}}}`}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFormData = { ...formData };
                          delete newFormData[key];
                          setFormData(newFormData);
                        }}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="bg-muted border-border focus:border-primary"
                    />
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Add New Placeholder</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Key"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      className="bg-muted border-border"
                    />
                    <Input
                      type="text"
                      placeholder="Value"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newKey.trim()) {
                        setFormData((prev) => ({ ...prev, [newKey.trim()]: newValue }));
                        setNewKey("");
                        setNewValue("");
                        success(`Placeholder {{${newKey.trim()}}} has been added.`, 2000);
                      }
                    }}
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                    disabled={!newKey.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Add Placeholder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Final Preview */}
            <Card className="bg-card/90 backdrop-blur-sm border-border shadow-lg animate-fade-in sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Eye className="w-5 h-5 text-primary" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-gradient-to-br from-muted to-card border border-border rounded-lg min-h-[200px]">
                  {blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Add blocks to see preview</p>
                      </div>
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <div key={block.id} className="animate-fade-in">
                        {renderPreview(block)}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
