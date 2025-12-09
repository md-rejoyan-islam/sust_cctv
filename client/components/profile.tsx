"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Save, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["user", "admin"]),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { data: user, refetch } = useGetProfileQuery();

  const [changePassword] = useChangePasswordMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role as "user" | "admin") ?? "user",
    },
  });

  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      name: user.name,
      email: user.email,
      role: user.role as "user" | "admin",
    });
  }, [user, profileForm]);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
      }).unwrap();
      toast.success("Profile updated successfully!");
      refetch();

      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Failed to update profile.", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password changed successfully!");

      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to change password.", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and security
        </p>
      </div>

      {/* Profile Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
          <Button
            variant={isEditingProfile ? "outline" : "default"}
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            {isEditingProfile ? "Cancel" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditingProfile ? (
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...profileForm.register("name")}
                    className="mt-2"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...profileForm.register("email")}
                    className="mt-2"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={profileForm.watch("role")}
                  onValueChange={(value: any) =>
                    profileForm.setValue("role", value)
                  }
                  disabled={true}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditingProfile(false);
                    profileForm.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Email Address
                    </p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              Security
            </CardTitle>
            <CardDescription>Change your password</CardDescription>
          </div>
          <Button
            variant={isChangingPassword ? "outline" : "default"}
            onClick={() => setIsChangingPassword(!isChangingPassword)}
          >
            {isChangingPassword ? "Cancel" : "Change Password"}
          </Button>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  {...passwordForm.register("currentPassword")}
                  className="mt-2"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-destructive text-sm mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    {...passwordForm.register("newPassword")}
                    className="mt-2"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-destructive text-sm mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    {...passwordForm.register("confirmPassword")}
                    className="mt-2"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    passwordForm.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Keep your account secure by regularly updating your password.
                Use a strong password with a mix of letters, numbers, and
                symbols.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
