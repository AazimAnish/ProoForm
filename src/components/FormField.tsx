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
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  label: string;
  options?: string[];
  required?: boolean;
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
      <Card className="bg-red-950/20 border-red-800/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Grip className="h-4 w-4 text-red-400 cursor-move" />
            <CardTitle className="text-sm font-medium text-red-100">
              Field Configuration
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-red-200">Field Type</Label>
            <Select
              value={element.type}
              onValueChange={(value: FormElement['type']) =>
                onUpdate({ ...element, type: value })
              }
            >
              <SelectTrigger className="bg-red-950/30 border-red-800/30 text-red-100">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent className="bg-red-950 border-red-800">
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Multiple Choice</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-red-200">Field Label</Label>
            <Input
              value={element.label}
              onChange={(e) => onUpdate({ ...element, label: e.target.value })}
              className="bg-red-950/30 border-red-800/30 text-red-100"
            />
          </div>

          {(element.type === 'radio' || element.type === 'select') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-red-200">Options</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-red-400 hover:text-red-300"
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
                        className="bg-red-950/30 border-red-800/30 text-red-100"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = element.options?.filter((_, i) => i !== index);
                          onUpdate({ ...element, options: newOptions });
                        }}
                        className="text-red-400 hover:text-red-300"
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
                    className="w-full border-red-800/30 text-red-500 hover:bg-red-950/50"
                  >
                    Add Option
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label className="text-red-200">Required Field</Label>
            <Switch
              checked={element.required}
              onCheckedChange={(checked) =>
                onUpdate({ ...element, required: checked })
              }
              className="data-[state=checked]:bg-red-600"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}