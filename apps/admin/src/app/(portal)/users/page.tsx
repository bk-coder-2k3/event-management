'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';
import { Users, Shield, UserX, UserCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterRole) params.set('role', filterRole);
      if (filterStatus) params.set('status', filterStatus);

      const res = await api.get<any[]>(`/admin/users?${params.toString()}`);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filterRole, filterStatus]);

  const handleSetStatus = async (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'DISABLED') => {
    if (!confirm(`Are you sure you want to set this user status to ${newStatus}?`)) return;

    try {
      const res = await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      if (res.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
      } else {
        alert(res.error?.message || 'Failed to update user status');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
            Platform Users Management ({users.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage customer and vendor user access permissions and security states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold"
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="VENDOR">Vendors</option>
            <option value="ADMIN">Administrators</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Vendor Business</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">{u.fullName}</span>
                        <span className="text-gray-500 text-[11px]">{u.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'VENDOR'
                              ? 'bg-gold-100 text-gold-900'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.status === 'ACTIVE' ? (
                          <Badge variant="success">Active</Badge>
                        ) : u.status === 'SUSPENDED' ? (
                          <Badge variant="warning">Suspended</Badge>
                        ) : (
                          <Badge variant="danger">Disabled</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {u.vendorProfile?.businessName || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {u.role !== 'ADMIN' && (
                          <>
                            {u.status !== 'ACTIVE' ? (
                              <button
                                onClick={() => handleSetStatus(u.id, 'ACTIVE')}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded hover:bg-emerald-100 text-xs transition"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSetStatus(u.id, 'SUSPENDED')}
                                className="px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold rounded hover:bg-amber-100 text-xs transition"
                              >
                                Suspend
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
