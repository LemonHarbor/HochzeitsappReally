import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

interface NotificationSetting {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  settings: NotificationSetting;
}

interface NotificationSettingsProps {
  categories?: NotificationCategory[];
}

const defaultCategories: NotificationCategory[] = [
  {
    id: "rsvp",
    title: "RSVP Updates",
    description: "Get notified when guests respond to your invitation",
    settings: {
      email: true,
      push: true,
      sms: false,
      inApp: true,
    },
  },
  {
    id: "guest-changes",
    title: "Guest List Changes",
    description: "Notifications about additions or changes to your guest list",
    settings: {
      email: true,
      push: false,
      sms: false,
      inApp: true,
    },
  },
  {
    id: "table-updates",
    title: "Table Arrangement Updates",
    description: "Get notified when changes are made to table arrangements",
    settings: {
      email: false,
      push: true,
      sms: false,
      inApp: true,
    },
  },
  {
    id: "reminders",
    title: "Wedding Timeline Reminders",
    description: "Reminders about upcoming deadlines and events",
    settings: {
      email: true,
      push: true,
      sms: true,
      inApp: true,
    },
  },
];

const NotificationSettings = ({
  categories = defaultCategories,
}: NotificationSettingsProps) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      notifications: categories.reduce(
        (acc, category) => {
          acc[category.id] = category.settings;
          return acc;
        },
        {} as Record<string, NotificationSetting>,
      ),
    },
  });

  const handleToggle = (
    categoryId: string,
    channel: keyof NotificationSetting,
    value: boolean,
  ) => {
    const currentValues = form.getValues();
    const updatedValues = {
      ...currentValues,
      notifications: {
        ...currentValues.notifications,
        [categoryId]: {
          ...currentValues.notifications[categoryId],
          [channel]: value,
        },
      },
    };
    form.reset(updatedValues);

    // In a real app, you would save these settings to the backend
    console.log("Updated notification settings:", updatedValues.notifications);

    // Show toast notification
    toast({
      title: "Notification settings updated",
      description: `${channel.charAt(0).toUpperCase() + channel.slice(1)} notifications ${value ? "enabled" : "disabled"} for ${categories.find((c) => c.id === categoryId)?.title}`,
    });
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Notification Settings
        </CardTitle>
        <CardDescription>
          Customize how and when you receive notifications about your wedding
          planning activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border-b pb-5 last:border-0 last:pb-0"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-medium">{category.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`notifications.${category.id}.email`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <FormLabel className="font-normal">Email</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) =>
                              handleToggle(category.id, "email", value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`notifications.${category.id}.push`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-gray-500" />
                          <FormLabel className="font-normal">
                            Push Notifications
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) =>
                              handleToggle(category.id, "push", value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`notifications.${category.id}.sms`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <FormLabel className="font-normal">SMS</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) =>
                              handleToggle(category.id, "sms", value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`notifications.${category.id}.inApp`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-gray-500" />
                          <FormLabel className="font-normal">
                            In-App Notifications
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) =>
                              handleToggle(category.id, "inApp", value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
