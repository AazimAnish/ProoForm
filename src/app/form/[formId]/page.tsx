"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FormPreview } from '@/components/FormPreview';
import { Card } from '@/components/ui/card';

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  label: string;
  options?: string[];
  required?: boolean;
}

export default function SharedForm() {
  const params = useParams();
  const [formElements, setFormElements] = useState<FormElement[]>([]);

  useEffect(() => {
    const formId = params?.formId as string;
    if (formId) {
      const storedForm = localStorage.getItem(formId);
      if (storedForm) {
        setFormElements(JSON.parse(storedForm));
      }
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-red-950/30 border-red-800/50">
          <h2 className="text-2xl font-bold text-red-100 mb-6">Shared Form</h2>
          <FormPreview elements={formElements} />
        </Card>
      </div>
    </div>
  );
}
