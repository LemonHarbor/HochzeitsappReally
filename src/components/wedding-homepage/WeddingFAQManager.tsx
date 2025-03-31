import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  HelpCircle, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";
import { WeddingFAQ } from "@/types/wedding-homepage";
import { 
  createWeddingFAQ, 
  getWeddingFAQsByHomepageId, 
  updateWeddingFAQ,
  deleteWeddingFAQ
} from "@/services/weddingHomepageService";

interface WeddingFAQManagerProps {
  homepageId: string;
}

const WeddingFAQManager: React.FC<WeddingFAQManagerProps> = ({ homepageId }) => {
  const [faqs, setFaqs] = useState<WeddingFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [savingFAQ, setSavingFAQ] = useState(false);
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);

  // Load FAQs
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingFAQsByHomepageId(homepageId);
        setFaqs(data);
      } catch (error) {
        console.error("Error loading wedding FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

  // Reset form
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setEditingFAQId(null);
  };

  // Set form for editing
  const setFormForEditing = (faq: WeddingFAQ) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditingFAQId(faq.id!);
  };

  // Save FAQ
  const handleSaveFAQ = async () => {
    if (!question || !answer) {
      alert("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    
    try {
      setSavingFAQ(true);
      
      const faqData = {
        homepage_id: homepageId,
        question,
        answer,
        order: editingFAQId 
          ? faqs.find(faq => faq.id === editingFAQId)?.order || 0
          : faqs.length // Add to the end
      };
      
      let savedFAQ: WeddingFAQ;
      
      if (editingFAQId) {
        // Update existing FAQ
        savedFAQ = await updateWeddingFAQ(editingFAQId, faqData);
        setFaqs(faqs.map(faq => 
          faq.id === editingFAQId ? savedFAQ : faq
        ));
      } else {
        // Create new FAQ
        savedFAQ = await createWeddingFAQ(faqData);
        setFaqs([...faqs, savedFAQ]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving wedding FAQ:", error);
      alert("Fehler beim Speichern der FAQ. Bitte versuche es erneut.");
    } finally {
      setSavingFAQ(false);
    }
  };

  // Delete FAQ
  const handleDeleteFAQ = async (faqId: string) => {
    if (!confirm("Bist du sicher, dass du diese FAQ löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteWeddingFAQ(faqId);
      setFaqs(faqs.filter(faq => faq.id !== faqId));
    } catch (error) {
      console.error("Error deleting wedding FAQ:", error);
      alert("Fehler beim Löschen der FAQ. Bitte versuche es erneut.");
    }
  };

  // Move FAQ up or down
  const handleMoveFAQ = async (faqId: string, direction: 'up' | 'down') => {
    const faqIndex = faqs.findIndex(faq => faq.id === faqId);
    if (
      (direction === 'up' && faqIndex === 0) || 
      (direction === 'down' && faqIndex === faqs.length - 1)
    ) {
      return; // Already at the top/bottom
    }
    
    const newIndex = direction === 'up' ? faqIndex - 1 : faqIndex + 1;
    const newFaqs = [...faqs];
    
    // Swap the FAQs
    [newFaqs[faqIndex], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[faqIndex]];
    
    // Update the order property
    const updatedFaqs = newFaqs.map((faq, index) => ({
      ...faq,
      order: index
    }));
    
    setFaqs(updatedFaqs);
    
    // Update the order in the database
    try {
      await updateWeddingFAQ(faqId, { order: newIndex });
      await updateWeddingFAQ(newFaqs[faqIndex].id!, { order: faqIndex });
    } catch (error) {
      console.error("Error updating FAQ order:", error);
      alert("Fehler beim Aktualisieren der Reihenfolge. Bitte versuche es erneut.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade FAQs...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Häufig gestellte Fragen</CardTitle>
        <CardDescription>
          Verwalte die FAQs für deine Hochzeitshomepage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine FAQs vorhanden. Füge FAQs hinzu, um deinen Gästen wichtige Informationen zu geben.
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={faq.id!}>
                <AccordionTrigger className="group">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">{faq.question}</div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveFAQ(faq.id!, 'up');
                        }}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveFAQ(faq.id!, 'down');
                        }}
                        disabled={index === faqs.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormForEditing(faq);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFAQ(faq.id!);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose max-w-none dark:prose-invert">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              FAQ hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingFAQId ? "FAQ bearbeiten" : "Neue FAQ hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                Füge eine häufig gestellte Frage und deren Antwort hinzu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question">Frage*</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="z.B. Gibt es Übernachtungsmöglichkeiten in der Nähe?"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="answer">Antwort*</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Deine Antwort auf die Frage..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSaveFAQ} 
                disabled={!question || !answer || savingFAQ}
              >
                {savingFAQ ? "Wird gespeichert..." : (editingFAQId ? "Aktualisieren" : "Hinzufügen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default WeddingFAQManager;
