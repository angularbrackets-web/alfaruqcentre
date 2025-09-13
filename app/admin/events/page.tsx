'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/app/types/event';
import { Plus, Edit2, Trash2, Calendar, Play, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?includeInactive=true');
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.message || 'Failed to fetch events');
      }
    } catch (error) {
      setError('Network error while fetching events');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        alert(`Failed to delete event: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Network error while deleting event');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedEvents.length === 0) return;

    if (bulkAction === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedEvents.length} event(s)? This action cannot be undone.`)) {
        return;
      }
    }

    try {
      const promises = selectedEvents.map(eventId => {
        if (bulkAction === 'activate') {
          return fetch(`/api/events/${eventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'active' })
          });
        } else if (bulkAction === 'deactivate') {
          return fetch(`/api/events/${eventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'inactive' })
          });
        } else if (bulkAction === 'delete') {
          return fetch(`/api/events/${eventId}`, { method: 'DELETE' });
        }
      });

      await Promise.all(promises);
      setSelectedEvents([]);
      setBulkAction('');
      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error performing bulk action');
    }
  };

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const toggleAllEvents = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(event => event.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const expiryDate = new Date(event.expiryDate);

    if (event.status === 'inactive') {
      return { text: 'Inactive', color: 'text-gray-500 bg-gray-100', icon: Clock };
    }
    if (now > expiryDate) {
      return { text: 'Expired', color: 'text-red-600 bg-red-100', icon: AlertCircle };
    }
    if (now >= startDate && now <= endDate) {
      return { text: 'Current', color: 'text-green-600 bg-green-100', icon: CheckCircle2 };
    }
    if (now < startDate) {
      return { text: 'Upcoming', color: 'text-blue-600 bg-blue-100', icon: Calendar };
    }
    return { text: 'Past', color: 'text-gray-600 bg-gray-100', icon: Clock };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Manage community events, announcements, and activities</p>
        </div>

        <Link
          href="/admin/events/add"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedEvents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-blue-700">
              {selectedEvents.length} event(s) selected
            </span>
            <div className="flex gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="text-sm border border-blue-300 rounded px-3 py-1"
              >
                <option value="">Choose action...</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
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

      {/* Events Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {events.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">No events found</p>
            <p className="mb-4">Get started by creating your first event.</p>
            <Link
              href="/admin/events/add"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEvents.length === events.length}
                      onChange={toggleAllEvents}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Media
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => {
                  const statusInfo = getEventStatus(event);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => toggleEventSelection(event.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {event.poster && (
                            <Image
                              src={event.poster}
                              alt={event.title}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">
                              {event.title}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            {event.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {event.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{event.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {event.startDate === event.endDate ? (
                              formatDate(event.startDate)
                            ) : (
                              <>
                                {formatDate(event.startDate)} - {formatDate(event.endDate)}
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Expires: {formatDate(event.expiryDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          {event.poster && <span className="text-blue-600">📷</span>}
                          {event.video && (
                            <span className="text-green-600">
                              <Play className="h-4 w-4 inline" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Edit Event"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Delete Event"
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

      {/* Summary Stats */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => getEventStatus(e).text === 'Upcoming').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => getEventStatus(e).text === 'Current').length}
            </div>
            <div className="text-sm text-gray-600">Current Events</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-600">
              {events.filter(e => getEventStatus(e).text === 'Past').length}
            </div>
            <div className="text-sm text-gray-600">Past Events</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactive Events</div>
          </div>
        </div>
      )}
    </div>
  );
}