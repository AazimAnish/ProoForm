"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Eye, Link as LinkIcon } from "lucide-react";
import { FormField } from "@/components/FormField"; 
import { FormPreview } from "@/components/FormPreview"; 
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);

const Droppable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Droppable),
  { ssr: false }
);

const Draggable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Draggable),
  { ssr: false }
);

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  label: string;
  options?: string[];
  required?: boolean;
}

export default function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(formElements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFormElements(items);
  };

  const generateShareLink = async () => {
    const newFormId = formId || crypto.randomUUID();
    setFormId(newFormId);
    
    try {
      await setDoc(doc(db, 'forms', newFormId), {
        elements: formElements,
        createdAt: new Date().toISOString()
      });
      router.push(`/form/${newFormId}`);
    } catch (error) {
      console.error("Error saving form: ", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Form Builder Panel */}
          <Card className="p-6 bg-red-950/30 border-red-800/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-100">Form Builder</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-red-800/50 text-red-500"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={generateShareLink}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-elements">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {formElements.map((element, index) => (
                      <Draggable
                        key={element.id}
                        draggableId={element.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <FormField
                              element={element}
                              onUpdate={(updated) => {
                                const newElements = [...formElements];
                                newElements[index] = updated;
                                setFormElements(newElements);
                              }}
                              onDelete={() => {
                                const newElements = formElements.filter((_, i) => i !== index);
                                setFormElements(newElements);
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <Button
              className="w-full mt-4 bg-red-600/80 hover:bg-red-700 text-white"
              onClick={() => {
                setFormElements([
                  ...formElements,
                  {
                    id: crypto.randomUUID(),
                    type: 'text',
                    label: 'New Field',
                  },
                ]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </Card>

          {/* Preview Panel */}
          <Card className="p-6 bg-red-950/30 border-red-800/50">
            <h2 className="text-2xl font-bold text-red-100 mb-6">Preview</h2>
            <FormPreview elements={formElements} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
