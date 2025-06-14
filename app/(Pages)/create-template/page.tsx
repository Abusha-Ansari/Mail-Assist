"use client";

import { useEffect, useRef, useState } from "react";
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
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();
  const originalTheme = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Save the original theme
    originalTheme.current = theme
    
    // Change to the desired theme (e.g., dark)
    setTheme('light')

    return () => {
      // Restore the original theme
      if (originalTheme.current) {
        setTheme(originalTheme.current)
      }
    }
  }, [theme,setTheme]);

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

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      failure("Template Name Required: Please enter a name for your template.", 2000);
      return;
    }

    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      success(`Template "${templateName}" has been saved successfully.`, 2000);
      
      // Reset form
      setTemplateName("");
      setBlocks([]);
      setFormData({
        name: "John Doe",
        company: "TechCorp",
        position: "Software Engineer"
      });
    } catch {
      failure("Save Failed: Failed to save template. Please try again.", 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {container}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-xl text-white">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Email Builder</h1>
              <p className="text-slate-600">Create beautiful email templates with ease</p>
            </div>
          </div>
          
          {/* Template Name and Save Actions */}
          <div className="flex items-center gap-4 animate-slide-in-right">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter template name..."
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-64 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={exportTemplate} variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                onClick={saveTemplate} 
                disabled={isSaving}
                className="gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
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
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg animate-scale-in">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Add Content Blocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => addBlock("heading")} 
                    variant="outline"
                    className="gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 hover-scale"
                  >
                    <Heading1 className="w-4 h-4 text-purple-600" />
                    Heading
                  </Button>
                  <Button 
                    onClick={() => addBlock("text")} 
                    variant="outline"
                    className="gap-2 bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 hover-scale"
                  >
                    <Type className="w-4 h-4 text-green-600" />
                    Text
                  </Button>
                  <Button 
                    onClick={() => addBlock("button")} 
                    variant="outline"
                    className="gap-2 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 hover-scale"
                  >
                    <MousePointer className="w-4 h-4 text-orange-600" />
                    Button
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blocks Editor */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <Card key={block.id} className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg animate-fade-in hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getBlockIcon(block.type)}
                        <Badge variant="secondary" className="capitalize">
                          {block.type}
                        </Badge>
                        <span className="text-sm text-slate-500">Block {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBlock(block.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Content Editor */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-slate-700">
                        <Edit className="w-4 h-4" />
                        Content
                      </Label>
                      <Textarea
                        rows={3}
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        className="bg-slate-50 border-slate-200 focus:border-blue-500 transition-colors resize-none"
                        placeholder={`Enter your ${block.type} content...`}
                      />
                    </div>

                    {/* Style Controls */}
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-slate-700">
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
                            <Label className="text-xs font-medium text-slate-600">{label}</Label>
                            {type === "select" ? (
                              <Select
                                value={block.styles[field as keyof Block["styles"]] ?? ""}
                                onValueChange={(value: string) =>
                                  updateBlockStyle(block.id, field as keyof Block["styles"], value)
                                }
                              >
                                <SelectTrigger className="h-9 bg-slate-50 border-slate-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
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
                                  className="w-12 h-9 p-1 bg-slate-50 border-slate-200"
                                />
                                <Input
                                  type="text"
                                  value={block.styles[field as keyof Block["styles"]] ?? ""}
                                  onChange={(e) =>
                                    updateBlockStyle(block.id, field as keyof Block["styles"], e.target.value)
                                  }
                                  className="flex-1 h-9 bg-slate-50 border-slate-200 font-mono text-sm"
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
                                className="h-9 bg-slate-50 border-slate-200"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Block Preview */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-slate-700">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Label>
                      <div className="p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg">
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
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Settings className="w-5 h-5 text-blue-500" />
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
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
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
                      className="bg-slate-50 border-slate-200 focus:border-blue-500"
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
                      className="bg-slate-50 border-slate-200"
                    />
                    <Input
                      type="text"
                      placeholder="Value"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="bg-slate-50 border-slate-200"
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
                    className="w-full gap-2 bg-blue-500 hover:bg-blue-600"
                    disabled={!newKey.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Add Placeholder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Final Preview */}
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg animate-fade-in sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Eye className="w-5 h-5 text-blue-500" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg min-h-[200px]">
                  {blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400">
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
