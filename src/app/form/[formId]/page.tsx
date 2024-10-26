"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FormPreview } from '@/components/FormPreview';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'github';
  label: string;
  options?: string[];
  required?: boolean;
  verificationCriteria?: string;
  githubVerificationType?: 'username' | 'email' | 'contributions' | 'repos' | 'followers';
}

export default function FormPage() {
  const { formId } = useParams();
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      if (typeof formId !== 'string') return;

      try {
        const docRef = doc(db, 'forms', formId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormElements(docSnap.data().elements);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-blue-950/30 border-blue-800/50">
          <h1 className="text-2xl font-bold text-blue-100 mb-6">Form Submission</h1>
          <FormPreview elements={formElements} formId={formId as string} />
        </Card>
      </div>
    </div>
  );
}
