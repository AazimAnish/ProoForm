"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, MoreVertical, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Submission {
    id: string;
    formData: Record<string, any>;
    proofs: Record<string, {
        value: string | number;
        isVerified: boolean;
        status: string;
    }>;
    submittedAt: string;
}

export default function SubmissionsPage() {
    const { formId } = useParams();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (typeof formId !== 'string') return;

            try {
                const q = query(
                    collection(db, 'submissions'),
                    where('formId', '==', formId)
                );
                const querySnapshot = await getDocs(q);
                const submissionsData: Submission[] = [];
                
                querySnapshot.forEach((doc) => {
                    submissionsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Submission);
                });

                setSubmissions(submissionsData.sort((a, b) => 
                    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
                ));
            } catch (error) {
                console.error('Error fetching submissions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [formId]);

    const downloadCsv = () => {
        if (submissions.length === 0) return;

        // Get all unique keys from formData across all submissions
        const allKeys = new Set<string>();
        submissions.forEach(submission => {
            Object.keys(submission.formData).forEach(key => allKeys.add(key));
        });

        // Create CSV header
        const headers = ['Submission ID', 'Submitted At', ...Array.from(allKeys)];
        
        // Create CSV rows
        const rows = submissions.map(submission => {
            const row = [
                submission.id,
                format(new Date(submission.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
                ...Array.from(allKeys).map(key => submission.formData[key] || '')
            ];
            return row.join(',');
        });

        // Combine headers and rows
        const csv = [headers.join(','), ...rows].join('\n');

        // Create and trigger download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submissions-${formId}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-blue-500">Loading submissions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black font-mono">
            <div className="container mx-auto px-4 py-8">
                <Card className="p-6 bg-blue-950/30 border-blue-800/50">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-blue-500">Form Submissions</h1>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="border-blue-800/50 text-blue-500 hover:bg-blue-500 hover:text-white"
                                onClick={() => router.push('/')}
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Button>
                            <Button
                                variant="outline"
                                className="border-blue-800/50 text-blue-500 hover:bg-blue-500 hover:text-white"
                                onClick={downloadCsv}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="text-center py-8 text-blue-400">
                            No submissions yet.
                        </div>
                    ) : (
                        <div className="rounded-md border border-blue-800/50">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-blue-950/50">
                                        <TableHead className="text-blue-400">Submission ID</TableHead>
                                        <TableHead className="text-blue-400">Submitted At</TableHead>
                                        <TableHead className="text-blue-400">Verification Status</TableHead>
                                        <TableHead className="text-blue-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.map((submission) => (
                                        <TableRow 
                                            key={submission.id}
                                            className="hover:bg-blue-950/50"
                                        >
                                            <TableCell className="font-mono text-blue-300">
                                                {submission.id.slice(0, 8)}...
                                            </TableCell>
                                            <TableCell className="text-blue-300">
                                                {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell className="text-blue-300">
                                                {Object.values(submission.proofs).every(proof => proof.isVerified)
                                                    ? "✅ All Verified"
                                                    : "❌ Some Failed"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4 text-blue-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-blue-950 border-blue-800">
                                                        <DropdownMenuLabel className="text-blue-400">
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className="text-blue-300 focus:text-white focus:bg-blue-900"
                                                            onClick={() => setSelectedSubmission(submission)}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>
            </div>

            <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                <DialogContent className="bg-blue-950 border-blue-800">
                    <DialogHeader>
                        <DialogTitle className="text-blue-300">Submission Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-blue-400 mb-2">Form Data</h3>
                            <div className="space-y-2">
                                {selectedSubmission && Object.entries(selectedSubmission.formData).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-start border-b border-blue-800/30 pb-2">
                                        <span className="text-blue-300 text-sm">{key}:</span>
                                        <span className="text-blue-100 text-sm text-right">
                                            {Array.isArray(value) ? value.join(', ') : value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-blue-400 mb-2">Verifications</h3>
                            <div className="space-y-2">
                                {selectedSubmission && Object.entries(selectedSubmission.proofs).map(([key, proof]) => (
                                    <div key={key} className="flex justify-between items-start border-b border-blue-800/30 pb-2">
                                        <span className="text-blue-300 text-sm">{key}:</span>
                                        <span className="text-blue-100 text-sm text-right">
                                            {proof.value} {proof.isVerified ? '✅' : '❌'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

