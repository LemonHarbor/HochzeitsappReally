import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../src/components/ui/alert-dialog";
import { useToast } from "../../../../src/components/ui/use-toast";
import { Shield, KeyRound, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface SecuritySettingsProps {
  currentEmail?: string;
  lastPasswordChange?: string;
  hasTwoFactorEnabled?: boolean;
}

const SecuritySettings = ({
  currentEmail = "user@example.com",
  lastPasswordChange = "3 months ago",
  hasTwoFactorEnabled = false,
}: SecuritySettingsProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const { toast } = useToast();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic would go here
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description:
          "Please make sure your new password and confirmation match.",
      });
      return;
    }

    // Simulate successful password change
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });

    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggleTwoFactor = () => {
    // Two-factor authentication toggle logic would go here
    toast({
      title: hasTwoFactorEnabled ? "Two-factor disabled" : "Two-factor enabled",
      description: hasTwoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled for your account.",
    });
  };

  return (
    <div className="w-full space-y-6 bg-background">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your password and account security settings
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Password Change Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Change Password</h3>
              <span className="text-sm text-muted-foreground">
                Last changed: {lastPasswordChange}
              </span>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="current-password"
                  className="text-sm font-medium"
                >
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit">Update Password</Button>
            </form>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button
                variant={hasTwoFactorEnabled ? "outline" : "default"}
                onClick={toggleTwoFactor}
              >
                {hasTwoFactorEnabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Email Address</h3>
                <p className="text-sm text-muted-foreground">{currentEmail}</p>
              </div>
              <Button variant="outline">Change Email</Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6 flex flex-col items-start">
          <div className="space-y-2 w-full">
            <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all of your data
            </p>
            <AlertDialog
              open={showDeleteAccountDialog}
              onOpenChange={setShowDeleteAccountDialog}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-2">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecuritySettings;
