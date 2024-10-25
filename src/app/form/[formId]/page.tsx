"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FormPreview } from '@/components/FormPreview';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FormSubmission } from '@/components/FormSubmission';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      const formId = params?.formId as string;
      if (formId) {
        try {
          const docRef = doc(db, 'forms', formId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setFormElements(docSnap.data().elements);
          } else {
            setError("Form not found");
          }
        } catch (err) {
          console.error("Error fetching form: ", err);
          setError("Error loading form");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchForm();
  }, [params]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-red-950/30 border-red-800/50">
          <h2 className="text-2xl font-bold text-red-100 mb-6">Shared Form</h2>
          <FormSubmission formId={params.formId as string} elements={formElements} />
        </Card>
      </div>
    </div>
  );
}
