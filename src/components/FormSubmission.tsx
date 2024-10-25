import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  label: string;
  options?: string[];
  required?: boolean;
}

interface FormSubmissionProps {
  formId: string;
  elements: FormElement[];
}

export function FormSubmission({ formId, elements }: FormSubmissionProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'forms', formId, 'submissions'), {
        ...formData,
        submittedAt: new Date().toISOString()
      });
      alert('Form submitted successfully!');
      setFormData({});
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {elements.map((element) => (
        <div key={element.id} className="space-y-2">
          <label className="text-red-200">{element.label}</label>
          {element.type === 'text' && (
            <Input
              required={element.required}
              value={formData[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              className="bg-red-950/30 border-red-800/30 text-red-100"
            />
          )}
          {element.type === 'textarea' && (
            <Textarea
              required={element.required}
              value={formData[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              className="bg-red-950/30 border-red-800/30 text-red-100"
            />
          )}
          {element.type === 'checkbox' && (
            <Checkbox
              checked={formData[element.id] || false}
              onCheckedChange={(checked) => handleInputChange(element.id, checked)}
              className="border-red-800/30 data-[state=checked]:bg-red-600"
            />
          )}
          {element.type === 'radio' && (
            <RadioGroup
              value={formData[element.id] || ''}
              onValueChange={(value) => handleInputChange(element.id, value)}
            >
              {element.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${element.id}-${option}`} />
                  <label htmlFor={`${element.id}-${option}`}>{option}</label>
                </div>
              ))}
            </RadioGroup>
          )}
          {element.type === 'select' && (
            <Select
              value={formData[element.id] || ''}
              onValueChange={(value) => handleInputChange(element.id, value)}
            >
              <SelectTrigger className="bg-red-950/30 border-red-800/30 text-red-100">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {element.options?.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
      <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
        Submit
      </Button>
    </form>
  );
}

