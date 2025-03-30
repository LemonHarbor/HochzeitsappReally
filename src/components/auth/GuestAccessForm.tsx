import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../src/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../../../src/components/ui/form";
import { Input } from "../../../../src/components/ui/input";
import { Button } from "../../../../src/components/ui/button";
import { Key, ArrowRight, Info } from "lucide-react";

const formSchema = z.object({
  accessCode: z.string().min(1, {
    message: "Please enter an access code",
  }),
});

interface GuestAccessFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

const GuestAccessForm = ({
  onSubmit = () => {},
  isLoading = false,
}: GuestAccessFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessCode: "DEMO123", // Pre-filled for easy testing
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Guest Access
        </CardTitle>
        <CardDescription className="text-center">
          Enter your invitation code to view details and RSVP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Code</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Key className="h-4 w-4 text-gray-400" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter your invitation code"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormDescription className="flex items-center text-xs mt-1">
                    <Info className="h-3 w-3 mr-1" />
                    For testing, any code will work
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Access Invitation <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          Having trouble with your code? Contact the couple for assistance.
        </div>
      </CardFooter>
    </Card>
  );
};

export default GuestAccessForm;
