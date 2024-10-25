"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  label: string;
  options?: string[];
  required?: boolean;
}

interface FormPreviewProps {
  elements: FormElement[];
}

export function FormPreview({ elements }: FormPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Label className="text-red-200">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {element.type === 'text' && (
            <Input
              required={element.required}
              className="bg-red-950/30 border-red-800/30 text-red-100"
              placeholder={`Enter ${element.label.toLowerCase()}`}
            />
          )}

          {element.type === 'textarea' && (
            <Textarea
              required={element.required}
              className="bg-red-950/30 border-red-800/30 text-red-100 min-h-[100px]"
              placeholder={`Enter ${element.label.toLowerCase()}`}
            />
          )}

          {element.type === 'checkbox' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                required={element.required}
                className="border-red-800/30 data-[state=checked]:bg-red-600"
              />
              <Label className="text-red-200">{element.label}</Label>
            </div>
          )}

          {element.type === 'radio' && (
            <RadioGroup className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    required={element.required}
                    className="border-red-800/30 text-red-600"
                  />
                  <Label className="text-red-200">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {element.type === 'select' && (
            <Select required={element.required}>
              <SelectTrigger className="bg-red-950/30 border-red-800/30 text-red-100">
                <SelectValue placeholder={`Select ${element.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-red-950 border-red-800">
                {element.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </motion.div>
      ))}

      {elements.length === 0 && (
        <div className="text-red-400 text-center py-8">
          Add form fields to see the preview
        </div>
      )}
    </motion.div>
  );
}
