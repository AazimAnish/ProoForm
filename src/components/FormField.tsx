"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Grip, Trash2, Plus, Minus } from "lucide-react";

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'developer' | 'social';
  label: string;
  options?: string[];
  required?: boolean;
  verificationCriteria?: string;
  developerVerificationType?: 'github_followers' | 'github_email' | 'github_contributions' | 'github_repos' | 'leetcode_problems' | 'leetcode_streak' | 'codechef_ranking';
  socialVerificationType?: 'linkedin_impressions' | 'youtube_views' | 'twitter_followers' | 'instagram_story_views' | 'instagram_followers';
}

interface FormFieldProps {
  element: FormElement;
  onUpdate: (updated: FormElement) => void;
  onDelete: () => void;
}

export function FormField({ element, onUpdate, onDelete }: FormFieldProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-blue-950/20 border-blue-800/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Grip className="h-4 w-4 text-blue-400 cursor-move" />
            <CardTitle className="text-sm font-medium text-blue-100">
              Field Configuration
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-blue-200">Field Type</Label>
            <Select
              value={element.type}
              onValueChange={(value: FormElement['type']) =>
                onUpdate({ ...element, type: value })
              }
            >
              <SelectTrigger className="bg-blue-950/30 border-blue-800/30 text-blue-100">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent className="bg-blue-950 border-blue-800">
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Multiple Choice</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="developer">Software Developer Verification</SelectItem>
                <SelectItem value="social">Social Media Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-blue-200">Field Label</Label>
            <Input
              value={element.label}
              onChange={(e) => onUpdate({ ...element, label: e.target.value })}
              className="bg-blue-950/30 border-blue-800/30 text-blue-100"
            />
          </div>

          {(element.type === 'radio' || element.type === 'select') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-blue-200">Options</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {showOptions ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              {showOptions && (
                <div className="space-y-2">
                  {element.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(element.options || [])];
                          newOptions[index] = e.target.value;
                          onUpdate({ ...element, options: newOptions });
                        }}
                        className="bg-blue-950/30 border-blue-800/30 text-blue-100"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = element.options?.filter((_, i) => i !== index);
                          onUpdate({ ...element, options: newOptions });
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...(element.options || []), ''];
                      onUpdate({ ...element, options: newOptions });
                    }}
                    className="w-full border-blue-800/30 text-blue-500 hover:bg-blue-950/50"
                  >
                    Add Option
                  </Button>
                </div>
              )}
            </div>
          )}

          {element.type === 'developer' && (
            <div className="space-y-2">
              <Label className="text-blue-200">Developer Verification Type</Label>
              <Select
                value={element.developerVerificationType || ''}
                onValueChange={(value) =>
                  onUpdate({ ...element, developerVerificationType: value as FormElement['developerVerificationType'] })
                }
              >
                <SelectTrigger className="bg-blue-950/30 border-blue-800/30 text-blue-100">
                  <SelectValue placeholder="Select verification type" />
                </SelectTrigger>
                <SelectContent className="bg-blue-950 border-blue-800">
                  <SelectItem value="github_followers">GitHub Followers</SelectItem>
                  <SelectItem value="github_email">GitHub Email</SelectItem>
                  <SelectItem value="github_contributions">GitHub Contributions</SelectItem>
                  <SelectItem value="github_repos">GitHub Repositories</SelectItem>
                  <SelectItem value="leetcode_problems">LeetCode Problems Solved</SelectItem>
                  <SelectItem value="leetcode_streak">LeetCode Max Streak</SelectItem>
                  <SelectItem value="codechef_ranking">CodeChef Ranking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {element.type === 'social' && (
            <div className="space-y-2">
              <Label className="text-blue-200">Social Media Verification Type</Label>
              <Select
                value={element.socialVerificationType || ''}
                onValueChange={(value) =>
                  onUpdate({ ...element, socialVerificationType: value as FormElement['socialVerificationType'] })
                }
              >
                <SelectTrigger className="bg-blue-950/30 border-blue-800/30 text-blue-100">
                  <SelectValue placeholder="Select social media verification type" />
                </SelectTrigger>
                <SelectContent className="bg-blue-950 border-blue-800">
                  <SelectItem value="linkedin_impressions">LinkedIn Post Impressions</SelectItem>
                  <SelectItem value="youtube_views">YouTube Channel Views</SelectItem>
                  <SelectItem value="twitter_followers">Twitter Followers</SelectItem>
                  <SelectItem value="instagram_story_views">Instagram Story Views</SelectItem>
                  <SelectItem value="instagram_followers">Instagram Followers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(element.type === 'developer' || element.type === 'social') && (element.developerVerificationType || element.socialVerificationType) && (
            <div className="space-y-2">
              <Label className="text-blue-200">Verification Criteria</Label>
              <Input
                value={element.verificationCriteria || ''}
                onChange={(e) => onUpdate({ ...element, verificationCriteria: e.target.value })}
                placeholder={
                  element.developerVerificationType === 'github_contributions' ||
                  element.developerVerificationType === 'github_repos' ||
                  element.developerVerificationType === 'leetcode_problems' ||
                  element.developerVerificationType === 'leetcode_streak' ||
                  element.developerVerificationType === 'codechef_ranking' ||
                  element.socialVerificationType === 'linkedin_impressions' ||
                  element.socialVerificationType === 'youtube_views' ||
                  element.socialVerificationType === 'twitter_followers' ||
                  element.socialVerificationType === 'instagram_story_views' ||
                  element.socialVerificationType === 'instagram_followers'
                    ? "Enter minimum number"
                    : "Enter expected value"
                }
                type={
                  element.developerVerificationType === 'github_contributions' ||
                  element.developerVerificationType === 'github_repos' ||
                  element.developerVerificationType === 'leetcode_problems' ||
                  element.developerVerificationType === 'leetcode_streak' ||
                  element.developerVerificationType === 'codechef_ranking' ||
                  element.socialVerificationType === 'linkedin_impressions' ||
                  element.socialVerificationType === 'youtube_views' ||
                  element.socialVerificationType === 'twitter_followers' ||
                  element.socialVerificationType === 'instagram_story_views' ||
                  element.socialVerificationType === 'instagram_followers'
                    ? "number"
                    : "text"
                }
                className="bg-blue-950/30 border-blue-800/30 text-blue-100"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label className="text-blue-200">Required Field</Label>
            <Switch
              checked={element.required}
              onCheckedChange={(checked) =>
                onUpdate({ ...element, required: checked })
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
