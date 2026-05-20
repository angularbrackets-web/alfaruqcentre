'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WeeklyClass, DAY_FULL, CATEGORY_OPTIONS } from '@/app/types/weeklyClass';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';

export default function AdminWeeklySchedule() {
  const [classes, setClasses] = useState<WeeklyClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/weekly-schedule?includeInactive=true');
      const data = await res.json();
      if (data.success) {
        setClasses(data.data);
      } else {
        setError(data.error || 'Failed to fetch classes');
      }
    } catch {
      setError('Network error while fetching classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/weekly-schedule/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setClasses((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch {
      alert('Network error while deleting');
    }
  };

  const toggleStatus = async (cls: WeeklyClass) => {
    const newStatus = cls.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/weekly-schedule/${cls.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setClasses((prev) => prev.map((c) => (c.id === cls.id ? data.data : c)));
      }
    } catch {
      alert('Network error while updating status');
    }
  };

  const formatDays = (days: string[]) =>
    days.map((d) => DAY_FULL[d] ?? d).join(', ');

  const getCategoryLabel = (cat: string) =>
    CATEGORY_OPTIONS.find((o) => o.value === cat)?.label ?? cat;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
          <p className="text-gray-600">Manage recurring weekly classes shown on the homepage</p>
        </div>
        <Link
          href="/admin/weekly-schedule/add"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Class
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {classes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No classes yet</p>
            <p className="mb-4 text-sm">Add your first recurring class to display it on the homepage.</p>
            <Link
              href="/admin/weekly-schedule/add"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add First Class
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        {cls.audience && (
                          <p className="text-xs text-gray-500 mt-0.5">{cls.audience}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDays(cls.days)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {cls.endTime ? `${cls.startTime} – ${cls.endTime}` : cls.startTime}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {getCategoryLabel(cls.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(cls)}
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer ${
                          cls.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cls.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/weekly-schedule/${cls.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(cls.id, cls.name)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      {classes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{classes.length}</div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {classes.filter((c) => c.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-600">
              {classes.filter((c) => c.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(classes.flatMap((c) => c.days)).size}
            </div>
            <div className="text-sm text-gray-600">Days Covered</div>
          </div>
        </div>
      )}
    </div>
  );
}
