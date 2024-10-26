"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'github';
  label: string;
  options?: string[];
  required?: boolean;
  verificationCriteria?: string;
  githubVerificationType?: 'username' | 'email' | 'contributions' | 'repos' | 'followers';
}

interface FormSubmissionProps {
  formId: string;
  elements: FormElement[];
}

const GITHUB_PROVIDER_IDS: Record<string, string> = {
  username: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_USERNAME || '',
  email: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_EMAIL || '',
  contributions: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_CONTRIBUTIONS || '',
  repos: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_REPOS || '',
  followers: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_FOLLOWERS || '',
};

export function FormSubmission({ formId, elements }: FormSubmissionProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [proofStatus, setProofStatus] = useState<Record<string, 'idle' | 'verifying' | 'verified' | 'failed'>>({});
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const initializeReclaim = async (providerId: string) => {
    const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID || '';
    const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET || '';
    return await ReclaimProofRequest.init(APP_ID, APP_SECRET, providerId);
  };

  const handleVerification = async (element: FormElement) => {
    if (!element.githubVerificationType) return;

    const elementId = element.id;
    setProofStatus(prev => ({ ...prev, [elementId]: 'verifying' }));

    try {
      const providerId = GITHUB_PROVIDER_IDS[element.githubVerificationType];
      const reclaimProofRequest = await initializeReclaim(providerId);
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      await reclaimProofRequest.startSession({
        onSuccess: (proofs: any) => {
          console.log('Proof received:', proofs);
          const proofValue = proofs?.parameters?.value;
          
          let isVerified = false;
          if (element.githubVerificationType === 'username' || element.githubVerificationType === 'email') {
            isVerified = proofValue === element.verificationCriteria;
          } else {
            const numericProof = parseInt(proofValue, 10);
            const numericCriteria = parseInt(element.verificationCriteria || '0', 10);
            isVerified = numericProof >= numericCriteria;
          }

          setProofStatus(prev => ({ ...prev, [elementId]: isVerified ? 'verified' : 'failed' }));
          setFormData(prev => ({ ...prev, [elementId]: proofValue }));
          toast({
            title: isVerified ? "Verification Successful" : "Verification Failed",
            description: isVerified 
              ? `Your GitHub ${element.githubVerificationType} has been verified.`
              : `Your GitHub ${element.githubVerificationType} does not meet the criteria.`,
            variant: isVerified ? "default" : "destructive",
          });
        },
        onError: (error: Error) => {
          console.error('Verification failed', error);
          setProofStatus(prev => ({ ...prev, [elementId]: 'failed' }));
          toast({
            title: "Verification Failed",
            description: `Failed to verify your GitHub ${element.githubVerificationType}. Please try again.`,
            variant: "destructive",
          });
        }
      });

      window.open(requestUrl, '_blank');
    } catch (error) {
      console.error('Verification process failed', error);
      setProofStatus(prev => ({ ...prev, [elementId]: 'failed' }));
      toast({
        title: "Verification Error",
        description: "An error occurred during the verification process. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'forms', formId, 'submissions'), {
        ...formData,
        proofStatus,
        submittedAt: new Date().toISOString()
      });
      toast({
        title: "Form Submitted",
        description: "Your form has been submitted successfully!",
      });
      setFormData({});
      setProofStatus({});
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({
        title: "Submission Error",
        description: "Error submitting form. Please try again.",
        variant: "destructive",
      });
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
          {element.type === 'github' && (
            <div className="space-y-2">
              <Button
                type="button"
                className={`${
                  proofStatus[element.id] === 'verified'
                    ? 'bg-green-600 hover:bg-green-700'
                    : proofStatus[element.id] === 'failed'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white flex items-center justify-center`}
                onClick={() => handleVerification(element)}
                disabled={proofStatus[element.id] === 'verifying'}
              >
                {proofStatus[element.id] === 'verified' && <CheckCircle className="w-4 h-4 mr-2" />}
                {proofStatus[element.id] === 'failed' && <XCircle className="w-4 h-4 mr-2" />}
                {proofStatus[element.id] === 'verified'
                  ? 'Proved!'
                  : proofStatus[element.id] === 'failed'
                  ? 'Try Again'
                  : proofStatus[element.id] === 'verifying'
                  ? 'Verifying...'
                  : `Prove GitHub ${element.githubVerificationType}`}
              </Button>
            </div>
          )}
        </div>
      ))}
      <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
        Submit
      </Button>
    </form>
  );
}
