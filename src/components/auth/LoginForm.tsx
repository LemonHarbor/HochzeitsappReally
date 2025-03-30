import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../src/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../src/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit?: (values: FormValues) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  isLoading?: boolean;
}

const LoginForm = ({
  onSubmit = () => {},
  onForgotPassword = () => {},
  onRegister = () => {},
  isLoading = false,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
              <Button
                type="button"
                variant="link"
                className="px-0"
                onClick={onForgotPassword}
              >
                Forgot password?
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button variant="link" className="p-0" onClick={onRegister}>
            Register
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
