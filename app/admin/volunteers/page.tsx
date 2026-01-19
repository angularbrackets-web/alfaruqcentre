'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Volunteer,
  VolunteerStatusType,
  VOLUNTEER_STATUS_LABELS,
  VOLUNTEER_STATUS_COLORS
} from '@/app/types/volunteer';
import { Users, Edit2, Trash2, Mail, Phone, Clock, CheckCircle, XCircle, UserCheck } from 'lucide-react';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter]);

  const fetchVolunteers = async () => {
    try {
      setIsLoading(true);
      const url = statusFilter === 'all'
        ? '/api/volunteers'
        : `/api/volunteers?status=${statusFilter}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setVolunteers(data.data);
      } else {
        setError(data.message || 'Failed to fetch volunteers');
      }
    } catch (error) {
      setError('Network error while fetching volunteers');
      console.error('Error fetching volunteers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (volunteerId: string) => {
    if (!confirm('Are you sure you want to delete this volunteer record? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/volunteers/${volunteerId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setVolunteers(volunteers.filter(v => v.id !== volunteerId));
      } else {
        alert(`Failed to delete volunteer: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Network error while deleting volunteer');
    }
  };

  const handleStatusChange = async (volunteerId: string, newStatus: VolunteerStatusType) => {
    try {
      const response = await fetch(`/api/volunteers/${volunteerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setVolunteers(volunteers.map(v =>
          v.id === volunteerId ? { ...v, status: newStatus } : v
        ));
      } else {
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Network error while updating status');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedVolunteers.length === 0) return;

    if (bulkAction === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedVolunteers.length} volunteer(s)? This action cannot be undone.`)) {
        return;
      }
    }

    try {
      const promises = selectedVolunteers.map(volunteerId => {
        if (bulkAction === 'delete') {
          return fetch(`/api/volunteers/${volunteerId}`, { method: 'DELETE' });
        } else {
          return fetch(`/api/volunteers/${volunteerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: bulkAction })
          });
        }
      });

      await Promise.all(promises);
      setSelectedVolunteers([]);
      setBulkAction('');
      fetchVolunteers();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error performing bulk action');
    }
  };

  const toggleVolunteerSelection = (volunteerId: string) => {
    setSelectedVolunteers(prev =>
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const toggleAllVolunteers = () => {
    if (selectedVolunteers.length === volunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map(v => v.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: VolunteerStatusType) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'contacted':
        return Mail;
      case 'enrolled':
        return CheckCircle;
      case 'declined':
        return XCircle;
      default:
        return Clock;
    }
  };

  // Count stats
  const stats = {
    total: volunteers.length,
    pending: volunteers.filter(v => v.status === 'pending').length,
    contacted: volunteers.filter(v => v.status === 'contacted').length,
    enrolled: volunteers.filter(v => v.status === 'enrolled').length,
    declined: volunteers.filter(v => v.status === 'declined').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading volunteers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <p className="text-gray-600">Review and manage volunteer registrations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.contacted}</div>
          <div className="text-sm text-gray-600">Contacted</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.enrolled}</div>
          <div className="text-sm text-gray-600">Enrolled</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          <div className="text-sm text-gray-600">Declined</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Volunteers</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="enrolled">Enrolled</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedVolunteers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-blue-700">
              {selectedVolunteers.length} volunteer(s) selected
            </span>
            <div className="flex gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="text-sm border border-blue-300 rounded px-3 py-1"
              >
                <option value="">Choose action...</option>
                <option value="pending">Mark Pending</option>
                <option value="contacted">Mark Contacted</option>
                <option value="enrolled">Mark Enrolled</option>
                <option value="declined">Mark Declined</option>
                <option value="delete">Delete</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {volunteers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">No volunteers found</p>
            <p>Volunteer registrations will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVolunteers.length === volunteers.length}
                      onChange={toggleAllVolunteers}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Areas of Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteers.map((volunteer) => {
                  const StatusIcon = getStatusIcon(volunteer.status);

                  return (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedVolunteers.includes(volunteer.id)}
                          onChange={() => toggleVolunteerSelection(volunteer.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {volunteer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {volunteer.availability.slice(0, 2).join(', ')}
                              {volunteer.availability.length > 2 && ` +${volunteer.availability.length - 2}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-900">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${volunteer.email}`} className="hover:text-blue-600">
                              {volunteer.email}
                            </a>
                          </div>
                          {volunteer.phone && (
                            <div className="flex items-center gap-1 text-gray-500 mt-1">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <a href={`tel:${volunteer.phone}`} className="hover:text-blue-600">
                                {volunteer.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.areasOfInterest.slice(0, 2).map((area, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {area.length > 20 ? area.substring(0, 20) + '...' : area}
                            </span>
                          ))}
                          {volunteer.areasOfInterest.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{volunteer.areasOfInterest.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={volunteer.status}
                          onChange={(e) => handleStatusChange(volunteer.id, e.target.value as VolunteerStatusType)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${VOLUNTEER_STATUS_COLORS[volunteer.status]}`}
                        >
                          {Object.entries(VOLUNTEER_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(volunteer.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/volunteers/${volunteer.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(volunteer.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Delete Volunteer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
