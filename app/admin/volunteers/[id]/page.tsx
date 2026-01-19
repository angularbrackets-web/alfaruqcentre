'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Volunteer,
  VolunteerStatusType,
  VOLUNTEER_STATUS_LABELS,
  VOLUNTEER_STATUS_COLORS
} from '@/app/types/volunteer';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  Loader2
} from 'lucide-react';

interface VolunteerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VolunteerDetailPage({ params }: VolunteerDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchVolunteer();
  }, [resolvedParams.id]);

  const fetchVolunteer = async () => {
    try {
      const response = await fetch(`/api/volunteers/${resolvedParams.id}`);
      const data = await response.json();

      if (data.success) {
        setVolunteer(data.data);
      } else {
        setError(data.message || 'Failed to fetch volunteer');
      }
    } catch (error) {
      setError('Network error while fetching volunteer');
      console.error('Error fetching volunteer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: VolunteerStatusType) => {
    if (!volunteer) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/volunteers/${volunteer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setVolunteer({ ...volunteer, status: newStatus });
      } else {
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Network error while updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!volunteer) return;

    if (!confirm('Are you sure you want to delete this volunteer record? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/volunteers/${volunteer.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/volunteers');
      } else {
        alert(`Failed to delete volunteer: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Network error while deleting volunteer');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading volunteer details...</div>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/volunteers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Volunteers
        </Link>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Volunteer not found'}
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(volunteer.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin/volunteers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Volunteers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Details</h1>
        </div>

        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete Volunteer
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-900">{volunteer.name}</h2>
                <div className="mt-2 space-y-2">
                  <a
                    href={`mailto:${volunteer.email}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                  >
                    <Mail className="h-4 w-4" />
                    {volunteer.email}
                  </a>
                  {volunteer.phone && (
                    <a
                      href={`tel:${volunteer.phone}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <Phone className="h-4 w-4" />
                      {volunteer.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Areas of Interest */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-emerald-600" />
              Areas of Interest
            </h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.areasOfInterest.map((area, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Availability
            </h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.availability.map((slot, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Message */}
          {volunteer.message && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Additional Message
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {volunteer.message}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
            <div className="space-y-4">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${VOLUNTEER_STATUS_COLORS[volunteer.status]}`}>
                <StatusIcon className="h-5 w-5" />
                <span className="font-medium">{VOLUNTEER_STATUS_LABELS[volunteer.status]}</span>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(VOLUNTEER_STATUS_LABELS).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => handleStatusChange(value as VolunteerStatusType)}
                      disabled={isUpdating || volunteer.status === value}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        volunteer.status === value
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        label
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Registered</p>
                <p className="text-gray-900">{formatDate(volunteer.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900">{formatDate(volunteer.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${volunteer.email}?subject=Volunteer Opportunity at Al-Faruq Islamic Centre`}
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Email
              </a>
              {volunteer.phone && (
                <a
                  href={`tel:${volunteer.phone}`}
                  className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Call Volunteer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
