"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Link as LinkIcon, Copy } from "lucide-react";
import { FormField } from "@/components/FormField"; 
import { FormPreview } from "@/components/FormPreview"; 
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

export interface FormElement {
    id: string;
    type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'developer' | 'social';
    label: string;
    options?: string[];
    required?: boolean;
    verificationCriteria?: string;
    developerVerificationType?: 'github_followers' | 'github_email' | 'github_contributions' | 'github_repos' | 'leetcode_problems' | 'leetcode_streak' | 'codechef_ranking';
    socialVerificationType?: 'linkedin_impressions' | 'youtube_views' | 'twitter_followers' | 'instagram_story_views' | 'instagram_followers';
  }

export default function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [showPreview, setShowPreview] = useState(false); 
  const [formId, setFormId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [shareLink, setShareLink] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (formId && isClient) {
      setShareLink(`${window.location.origin}/form/${formId}`);
    }
  }, [formId, isClient]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
    e.preventDefault();
    e.currentTarget.style.borderTop = "2px solid #3b82f6";
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderTop = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.borderTop = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.currentTarget.style.borderTop = "";
    const draggedItemIndex = dragItem.current;
    const targetIndex = index;

    if (draggedItemIndex === null || targetIndex === draggedItemIndex) return;

    const newFormElements = [...formElements];
    const draggedItem = newFormElements[draggedItemIndex];
    newFormElements.splice(draggedItemIndex, 1);
    newFormElements.splice(targetIndex, 0, draggedItem);

    setFormElements(newFormElements);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const generateShareLink = async () => {
    const newFormId = formId || crypto.randomUUID();
    setFormId(newFormId);
    
    try {
      await setDoc(doc(db, 'forms', newFormId), {
        elements: formElements,
        createdAt: new Date().toISOString()
      });
      setShareLink(`${window.location.origin}/form/${newFormId}`);
    } catch (error) {
      console.error("Error saving form: ", error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link Copied",
        description: "Form share link has been copied to clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold text-blue-500">Form Builder</h1>
          
          {/* Share Link Section */}
          {formId && (
            <Card className="p-6 bg-blue-950/30 border-blue-800/50">
              <h2 className="text-xl font-semibold text-white mb-4">Share Form</h2>
              <div className="flex items-center space-x-2">
                <Input 
                  value={shareLink}
                  readOnly
                  className="bg-blue-950/30 border-blue-800/30 text-white"
                />
                <Button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-white mt-2">Share this link to allow others to fill out your form.</p>
            </Card>
          )}

          {/* Form Builder Card */}
          <Card className="p-6 bg-blue-950/30 border-blue-800/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Form Builder</h2>
              <div className="flex gap-2">
                <Button
                  variant={showPreview ? "default" : "outline"}
                  className={`${
                    showPreview 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "border-blue-800/50 text-blue-500"
                  }`}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={generateShareLink}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {formElements.map((element, index) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <FormField
                    element={element}
                    onUpdate={(updated) => {
                      const newElements = [...formElements];
                      newElements[index] = updated;
                      setFormElements(newElements);
                    }}
                    onDelete={() => {
                      const newElements = formElements.filter((_, i) => i !== index);
                      setFormElements(newElements);
                    }}
                  />
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-4 bg-blue-600/80 hover:bg-blue-700 text-white"
              onClick={() => {
                setFormElements([
                  ...formElements,
                  {
                    id: crypto.randomUUID(),
                    type: 'text',
                    label: '',
                  },
                ]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </Card>

          {/* Preview Panel - Only show when showPreview is true */}
          {showPreview && (
            <Card className="p-6 bg-blue-950/30 border-blue-800/50">
              <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>
              <FormPreview elements={formElements} />
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
