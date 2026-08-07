"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";
import { Pagination } from "@/app/(publicGroup)/_components/GearCard";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/users?page=${page}&limit=10`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        setUsers(j.data || []);
        setTotalPages(j.meta?.totalPages || 1);
      });
  }, [page]);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success(`User ${status === "ACTIVE" ? "activated" : "suspended"}`);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    } else toast.error(json.message);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">User Management</h1>
      <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">{u.status}</td>
                <td className="p-4">
                  {u.status === "ACTIVE" ? (
                    <Button size="sm" variant="destructive" onClick={() => toggleStatus(u.id, "SUSPENDED")}>Suspend</Button>
                  ) : (
                    <Button size="sm" onClick={() => toggleStatus(u.id, "ACTIVE")}>Activate</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
