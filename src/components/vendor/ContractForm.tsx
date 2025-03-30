import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Upload, Plus, Trash2 } from "lucide-react";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useLanguage } from "../../../../src/lib/language";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../src/components/ui/form";
import { Input } from "../../../../src/components/ui/input";
import { Button } from "../../../../src/components/ui/button";
import { Textarea } from "../../../../src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../src/components/ui/card";
import { Calendar } from "../../../../src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../../../src/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  signed_date: z.date().optional(),
  expiration_date: z.date().optional(),
  status: z.enum(["draft", "pending", "active", "expired", "cancelled"], {
    required_error: "Please select a status",
  }),
  notes: z.string().optional(),
  key_terms: z.record(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContractFormProps {
  vendorId: string;
  initialData?: Partial<FormValues>;
  onSubmit?: (data: FormValues, file: File) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({
  vendorId,
  initialData = {},
  onSubmit = () => {},
  onCancel = () => {},
  isEditing = false,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [keyTerms, setKeyTerms] = useState<{ key: string; value: string }[]>(
    initialData.key_terms
      ? Object.entries(initialData.key_terms).map(([key, value]) => ({
          key,
          value: value as string,
        }))
      : [{ key: "", value: "" }],
  );

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      signed_date: initialData.signed_date
        ? new Date(initialData.signed_date)
        : undefined,
      expiration_date: initialData.expiration_date
        ? new Date(initialData.expiration_date)
        : undefined,
      status: initialData.status || "draft",
      notes: initialData.notes || "",
      key_terms: initialData.key_terms || {},
    },
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Add a new key term field
  const addKeyTerm = () => {
    setKeyTerms([...keyTerms, { key: "", value: "" }]);
  };

  // Remove a key term field
  const removeKeyTerm = (index: number) => {
    const newKeyTerms = [...keyTerms];
    newKeyTerms.splice(index, 1);
    setKeyTerms(newKeyTerms);
  };

  // Update a key term field
  const updateKeyTerm = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newKeyTerms = [...keyTerms];
    newKeyTerms[index][field] = value;
    setKeyTerms(newKeyTerms);
  };

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    try {
      if (!file && !isEditing) {
        toast({
          variant: "destructive",
          title: "File Required",
          description: "Please upload a contract file.",
        });
        return;
      }

      // Convert key terms array to object
      const keyTermsObject: Record<string, string> = {};
      keyTerms.forEach((term) => {
        if (term.key.trim() && term.value.trim()) {
          keyTermsObject[term.key.trim()] = term.value.trim();
        }
      });

      // Add vendor_id and key terms to the data
      const contractData = {
        ...values,
        vendor_id: vendorId,
        key_terms: keyTermsObject,
      };

      if (file) {
        onSubmit(contractData, file);
      } else if (isEditing) {
        // For editing without changing the file
        onSubmit(contractData, null as unknown as File);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} contract: ${error.message}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Contract" : "Add New Contract"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update contract information"
            : "Add a new contract for this vendor"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Venue Rental Agreement"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="signed_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Signed Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When was this contract signed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When does this contract expire?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Contract File</FormLabel>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <input
                  type="file"
                  id="contract-file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="contract-file"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">
                    {file
                      ? file.name
                      : isEditing
                        ? "Upload new file (optional)"
                        : "Click to upload contract file"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX or TXT (max. 10MB)
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Key Terms</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeyTerm}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Term
                </Button>
              </div>
              <div className="space-y-2">
                {keyTerms.map((term, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Term name"
                        value={term.key}
                        onChange={(e) =>
                          updateKeyTerm(index, "key", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Term value"
                        value={term.value}
                        onChange={(e) =>
                          updateKeyTerm(index, "value", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKeyTerm(index)}
                      disabled={keyTerms.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormDescription>
                Add important terms from the contract for quick reference
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this contract"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Contract" : "Add Contract"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContractForm;
