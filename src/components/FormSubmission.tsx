import React, { useState } from 'react';
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
import { QRCodeSVG } from 'qrcode.react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface FormElement {
    id: string;
    type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'developer' | 'social';
    label: string;
    options?: string[];
    required?: boolean;
    verificationCriteria?: string;
    developerVerificationType?: 'github_followers' | 'github_email' | 'github_contributions' | 'github_repos' | 'leetcode_problems' | 'leetcode_streak' | 'codechef_ranking';
    socialVerificationType?: 'twitter_followers' | 'instagram_story_views' | 'instagram_followers' | 'linkedin_impressions' | 'youtube_views';
}

interface FormSubmissionProps {
    formId: string;
    elements: FormElement[];
}

interface ProofDetails {
    value: string | number;
    isVerified: boolean;
    proofObject?: any;
    status: 'idle' | 'verifying' | 'verified' | 'failed';
}

const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID || '';
const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET || '';
const PROVIDER_IDS: Record<string, string> = {
    // Developer verification providers
    github_followers: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_FOLLOWERS || '',
    github_email: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_EMAIL || '',
    github_contributions: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_CONTRIBUTIONS || '',
    github_repos: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_REPOS || '',
    leetcode_problems: process.env.NEXT_PUBLIC_LEETCODE_PROVIDER_PROBLEMS || '',
    leetcode_streak: process.env.NEXT_PUBLIC_LEETCODE_PROVIDER_STREAK || '',
    codechef_ranking: process.env.NEXT_PUBLIC_CODECHEF_PROVIDER_RANKING || '',
    
    // Social media verification providers
    twitter_followers: process.env.NEXT_PUBLIC_TWITTER_FOLLOWERS_COUNT || '',
    instagram_story_views: process.env.NEXT_PUBLIC_INSTAGRAM_STORY_VIEW || '',
    instagram_followers: process.env.NEXT_PUBLIC_INSTAGRAM_FOLLOWERS_COUNT || '',
    linkedin_impressions: process.env.NEXT_PUBLIC_LINKEDIN_IMPRESSIONS || '',
    youtube_views: process.env.NEXT_PUBLIC_YOUTUBE_VIEWS || '',
};

export function FormSubmission({ formId, elements }: FormSubmissionProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [proofDetails, setProofDetails] = useState<Record<string, ProofDetails>>({});
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const [currentElement, setCurrentElement] = useState<FormElement | null>(null);

    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [id]: value === undefined ? null : value
        }));
    };

    const extractProofValue = (proofs: any, element: FormElement): string | number => {
        try {
            const parameters = JSON.parse(proofs.claimData.parameters);
            const context = JSON.parse(proofs.claimData.context);
            const extractedParams = context.extractedParameters;

            if (element.type === 'developer') {
                switch (element.developerVerificationType) {
                    case 'github_contributions':
                        const contributionsStr = extractedParams.contributions || '';
                        return parseInt(contributionsStr.replace(/\D/g, ''), 10);
                    case 'github_repos':
                        return parseInt(extractedParams.repos || '0', 10);
                    case 'github_followers':
                        return parseInt(extractedParams.followers || '0', 10);
                    case 'leetcode_problems':
                        return parseInt(extractedParams.problems || '0', 10);
                    case 'leetcode_streak':
                        return parseInt(extractedParams.streak || '0', 10);
                    case 'codechef_ranking':
                        return parseInt(extractedParams.ranking || '0', 10);
                    case 'github_email':
                        return extractedParams.email || '';
                    default:
                        return '';
                }
            } else if (element.type === 'social') {
                return parseInt(extractedParams[element.socialVerificationType!] || '0', 10);
            }

            return '';
        } catch (error) {
            console.error('Error extracting proof value:', error);
            return '';
        }
    };

    const verifyProof = (element: FormElement, proofValue: string | number): boolean => {
        if (!element.verificationCriteria) return false;

        if (element.type === 'developer' || element.type === 'social') {
            switch (element.developerVerificationType || element.socialVerificationType) {
                case 'github_email':
                    return String(proofValue).toLowerCase() === element.verificationCriteria.toLowerCase();
                case 'github_contributions':
                case 'github_repos':
                case 'github_followers':
                case 'leetcode_problems':
                case 'leetcode_streak':
                case 'codechef_ranking':
                case 'twitter_followers':
                case 'instagram_story_views':
                case 'instagram_followers':
                    const numericValue = typeof proofValue === 'string' ? parseInt(proofValue, 10) : proofValue;
                    const criteriaValue = parseInt(element.verificationCriteria, 10);
                    return !isNaN(numericValue) && !isNaN(criteriaValue) && numericValue >= criteriaValue;
                default:
                    return false;
            }
        }

        return false;
    };

    const handleVerification = async (element: FormElement) => {
        if (!element.developerVerificationType && !element.socialVerificationType) return;

        const elementId = element.id;
        setProofDetails(prev => ({
            ...prev,
            [elementId]: { value: '', isVerified: false, status: 'verifying' }
        }));
        setIsDialogOpen(true);
        setCurrentElement(element);

        try {
            const providerId = element.type === 'developer'
                ? PROVIDER_IDS[element.developerVerificationType!]
                : PROVIDER_IDS[element.socialVerificationType!];

            const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, providerId);
            const requestUrl = await reclaimProofRequest.getRequestUrl();
            setQrCodeUrl(requestUrl);

            await reclaimProofRequest.startSession({
                onSuccess: (proofs: any) => {
                    console.log('Reclaim return data:', proofs);

                    const proofValue = extractProofValue(proofs, element);
                    const isVerified = verifyProof(element, proofValue);

                    setProofDetails(prev => ({
                        ...prev,
                        [elementId]: {
                            value: proofValue,
                            isVerified,
                            proofObject: proofs,
                            status: isVerified ? 'verified' : 'failed'
                        }
                    }));

                    setIsDialogOpen(false);
                    toast({
                        title: isVerified ? "Verification Successful" : "Verification Failed",
                        description: isVerified
                            ? `Your ${element.type} ${element.developerVerificationType || element.socialVerificationType} (${proofValue}) meets the criteria.`
                            : `Your ${element.type} ${element.developerVerificationType || element.socialVerificationType} (${proofValue}) does not meet the criteria (${element.verificationCriteria}).`,
                        variant: isVerified ? "default" : "destructive",
                    });
                },
                onError: (error: Error) => {
                    console.error('Verification failed', error);
                    setProofDetails(prev => ({
                        ...prev,
                        [elementId]: {
                            value: '',
                            isVerified: false,
                            status: 'failed'
                        }
                    }));
                    setIsDialogOpen(false);
                    toast({
                        title: "Verification Failed",
                        description: error.message || "An error occurred during verification.",
                        variant: "destructive",
                    });
                }
            });
        } catch (error) {
            console.error('Verification process failed', error);
            setProofDetails(prev => ({
                ...prev,
                [elementId]: {
                    value: '',
                    isVerified: false,
                    status: 'failed'
                }
            }));
            setIsDialogOpen(false);
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
            const formDataToSubmit = {
                ...formData,
                proofs: Object.entries(proofDetails).reduce((acc, [key, details]) => {
                    acc[key] = {
                        value: details.value,
                        isVerified: details.isVerified,
                        status: details.status,
                        proofObject: details.proofObject,
                        timestamp: new Date().toISOString()
                    };
                    return acc;
                }, {} as Record<string, any>),
                submittedAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'forms', formId, 'submissions'), formDataToSubmit);

            toast({
                title: "Form Submitted",
                description: "Your form has been submitted successfully!",
            });

            setFormData({});
            setProofDetails({});
        } catch (error) {
            console.error("Error submitting form: ", error);
            toast({
                title: "Submission Error",
                description: error instanceof Error ? error.message : "Error submitting form. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {elements.map((element) => (
                <div key={element.id} className="space-y-2">
                    <Label htmlFor={element.id} className="text-blue-200">
                        {element.label}
                        {element.required && <span className="text-blue-500 ml-1">*</span>}
                    </Label>
                    {element.type === 'text' && (
                        <Input
                            required={element.required}
                            value={formData[element.id] || ''}
                            onChange={(e) => handleInputChange(element.id, e.target.value)}
                            className="bg-blue-950/30 border-blue-800/30 text-blue-100"
                        />
                    )}
                    {element.type === 'textarea' && (
                        <Textarea
                            required={element.required}
                            value={formData[element.id] || ''}
                            onChange={(e) => handleInputChange(element.id, e.target.value)}
                            className="bg-blue-950/30 border-blue-800/30 text-blue-100"
                        />
                    )}
                    {element.type === 'checkbox' && (
                        <Checkbox
                            checked={formData[element.id] || false}
                            onCheckedChange={(checked) => handleInputChange(element.id, checked)}
                            className="border-blue-800/30 data-[state=checked]:bg-blue-600"
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
                            <SelectTrigger className="bg-blue-950/30 border-blue-800/30 text-blue-100">
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {element.options?.map((option) => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {(element.type === 'developer' || element.type === 'social') && (
                        <div className="space-y-2">
                            <Button
                                type="button"
                                className={`${proofDetails[element.id]?.status === 'verified'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : proofDetails[element.id]?.status === 'failed'
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white flex items-center justify-center`}
                                onClick={() => handleVerification(element)}
                                disabled={proofDetails[element.id]?.status === 'verifying'}
                            >
                                {proofDetails[element.id]?.status === 'verified' && <CheckCircle className="w-4 h-4 mr-2" />}
                                {proofDetails[element.id]?.status === 'failed' && <XCircle className="w-4 h-4 mr-2" />}
                                {proofDetails[element.id]?.status === 'verified'
                                    ? 'Proved!'
                                    : proofDetails[element.id]?.status === 'failed'
                                        ? 'Try Again'
                                        : proofDetails[element.id]?.status === 'verifying'
                                            ? 'Verifying...'
                                            : `Prove ${element.type} ${element.developerVerificationType || element.socialVerificationType}`}
                            </Button>
                            {/* {proofDetails[element.id]?.status === 'verified' && (
                                <p className="text-green-500 text-sm">
                                    Verified: {proofDetails[element.id].value} {element.type} {element.developerVerificationType || element.socialVerificationType}
                                </p>
                            )} */}
                        </div>
                    )}
                </div>
            ))}
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Scan QR Code to Prove</DialogTitle>
                        <DialogDescription>
                            Scan this QR code with your mobile device to complete the verification process.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-4">
                        {qrCodeUrl ? (
                            <QRCodeSVG value={qrCodeUrl} size={256} />
                        ) : (
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Generating QR Code...</p>
                                <p className="text-sm text-gray-500">Please wait while we prepare your verification.</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500 animate-pulse">
                            Waiting for proof... This might take a moment.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </form>
    );
}
