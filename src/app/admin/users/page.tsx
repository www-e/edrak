"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { DataTable } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "PROFESSOR" | "STUDENT";
  isActive: boolean;
  createdAt: Date;
}

export default function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof User>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { data, isLoading } = api.admin.user.getAll.useQuery();
  
  const users = data ?? [];
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  
  // Paginate users
  const pageSize = 10;
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const columns = [
    {
      key: "username" as keyof User,
      title: "Username",
    },
    {
      key: "firstName" as keyof User,
      title: "First Name",
    },
    {
      key: "lastName" as keyof User,
      title: "Last Name",
    },
    {
      key: "role" as keyof User,
      title: "Role",
      render: (value: User[keyof User]) => (
        <StatusBadge variant={value === "ADMIN" ? "destructive" : value === "PROFESSOR" ? "warning" : "default"}>
          {value as string}
        </StatusBadge>
      ),
    },
    {
      key: "isActive" as keyof User,
      title: "Status",
      render: (value: User[keyof User]) => (
        <StatusBadge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      key: "createdAt" as keyof User,
      title: "Created",
      render: (value: User[keyof User]) => (value as Date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage all platform users"
        actions={
          <Button onClick={() => router.push("/admin/users/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchFilter
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search users..."
          className="w-full md:w-80"
        />
      </div>
      
      <DataTable
        data={paginatedUsers}
        columns={columns}
        loading={isLoading}
        pagination={{
          page,
          pageSize,
          total: filteredUsers.length,
          onPageChange: setPage,
        }}
        sorting={{
          sortBy,
          sortOrder,
          onSortChange: (newSortBy, newSortOrder) => {
            setSortBy(newSortBy as keyof User);
            setSortOrder(newSortOrder);
            setPage(1);
          },
        }}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
            <Button 
              className="mt-4" 
              onClick={() => router.push("/admin/users/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First User
            </Button>
          </div>
        }
      />
    </div>
  );
}