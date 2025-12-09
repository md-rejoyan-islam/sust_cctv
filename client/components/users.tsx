"use client";

import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { PasswordChangeDialog } from "@/components/dialogs/password-change-dialog";
import { UserDialog } from "@/components/dialogs/user-dialog";
import SimpleTable from "@/components/simple-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProfileQuery } from "@/lib/api/auth";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useUserChangePasswordMutation,
} from "@/lib/api/users";
import type { IUserSchema } from "@/lib/types";
import type {
  AdminPasswordChangeFormData,
  UserFormData,
} from "@/lib/validation";
import { Edit2, Key, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "role">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserSchema | null>(null);

  const { data: usersData, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm || undefined,
  });

  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [changePassword] = useUserChangePasswordMutation();
  const { data: loginiUser } = useGetProfileQuery();

  const handleAddUser = async (data: UserFormData) => {
    try {
      await addUser(data).unwrap();
      setIsAddDialogOpen(false);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to add user", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser?._id) return;
    try {
      await updateUser({ id: selectedUser._id, data }).unwrap();
      setSelectedUser(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update user", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const handleChangePassword = async (data: AdminPasswordChangeFormData) => {
    try {
      await changePassword({
        id: data.id,
        newPassword: data.newPassword,
      }).unwrap();
      setIsPasswordDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add user", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) return;
    try {
      await deleteUser(selectedUser._id).unwrap();
      setIsDeleteDialogOpen(false);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user", {
        description: (error as any)?.data?.message || "",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage system users and permissions
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
            disabled={loginiUser?.role !== "admin"}
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search
                </label>
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(value: any) => setSortBy(value)}
                >
                  <SelectTrigger className="h-10 min-w-20">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex md:justify-end items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Results
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {usersData?.pagination?.items || 0} users found
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>All users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              currentPage={currentPage}
              columns={[
                "#",
                "Name",
                "Email",
                "Role",
                "Change Password",
                "Actions",
              ]}
              body={
                usersData?.data?.map((user, index) => [
                  (index + 1 + (currentPage - 1) * ITEMS_PER_PAGE).toString(),
                  user.name,
                  user.email,
                  user.role === "admin" ? "Admin" : "User",
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={
                      loginiUser?.role === "admin"
                        ? false
                        : loginiUser?._id === user._id
                        ? false
                        : true
                    }
                    onClick={() => {
                      setSelectedUser(user);
                      setIsPasswordDialogOpen(true);
                    }}
                    className="gap-2 border"
                  >
                    <Key className="w-4 h-4" />
                    <span className="hidden sm:inline">Password</span>
                  </Button>,
                  <div
                    className="flex items-center justify-end gap-2"
                    key={user._id}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        loginiUser?.role === "admin"
                          ? false
                          : loginiUser?._id === user._id
                          ? false
                          : true
                      }
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditDialogOpen(true);
                      }}
                      className="bg-blue-50 hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={loginiUser?.role !== "admin"}
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-destructive hover:text-destructive hover:bg-red-200 bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>,
                ]) || []
              }
              noDataMessage="No users found"
              isLoading={isLoading}
              totalPages={usersData?.pagination?.totalPages}
              setCurrentPage={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <UserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddUser}
      />

      {/* Edit User Dialog */}
      {selectedUser && (
        <UserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateUser}
          initialData={{
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
          }}
          title="Edit User"
          isEditMode={true}
        />
      )}

      {/* Password Change Dialog */}
      {selectedUser && (
        <PasswordChangeDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          onSubmit={handleChangePassword}
          userName={selectedUser.name}
          userId={selectedUser._id}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedUser && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete User"
          description={`Are you sure you want to delete "${selectedUser.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteUser}
        />
      )}
    </>
  );
}
