'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api-client';
import { ShieldAlert, Clock, User, Globe } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await api.get<any[]>('/admin/audit-logs?limit=50');
        if (res.success && res.data) {
          setLogs(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
          Platform Security & Audit Trail ({logs.length})
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Immutable audit record of administrative actions, vendor status decisions, and moderation events.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : logs.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Administrator</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-burgundy-900 bg-burgundy-50 px-2 py-0.5 rounded border border-burgundy-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {log.entityType} ({log.entityId.substring(0, 8)}...)
                      </td>
                      <td className="py-3 px-4 font-sans text-gray-800">
                        {log.user ? (
                          <span>{log.user.fullName} ({log.user.email})</span>
                        ) : (
                          <span className="text-gray-400">System</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border p-8 text-gray-500 text-sm">
          No audit records found.
        </div>
      )}
    </div>
  );
}
