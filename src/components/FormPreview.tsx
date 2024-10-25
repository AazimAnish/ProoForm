"use client";

import { FormSubmission } from './FormSubmission';

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'github';
  label: string;
  options?: string[];
  required?: boolean;
  verificationCriteria?: string;
  githubVerificationType?: 'username' | 'email' | 'contributions' | 'repos' | 'followers';
}

interface FormPreviewProps {
  elements: FormElement[];
  formId?: string;
}

export function FormPreview({ elements, formId = 'preview' }: FormPreviewProps) {
  return (
    <div className="space-y-6">
      <FormSubmission formId={formId} elements={elements} />
    </div>
  );
}
