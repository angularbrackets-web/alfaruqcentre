'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Program } from '@/app/types/program';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, FileText } from 'lucide-react';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch programs from API
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      // Fetch all programs including inactive ones for admin
      const response = await fetch('/api/programs?includeInactive=true');
      const data = await response.json();
      
      if (data.success) {
        setPrograms(data.data);
      } else {
        setError(data.message || 'Failed to fetch programs');
      }
    } catch (err) {
      setError('Error loading programs');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) {
      return;
    }

    setDeletingId(programId);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setPrograms(programs.filter(p => p.id !== programId));
      } else {
        alert(data.message || 'Failed to delete program');
      }
    } catch (err) {
      alert('Error deleting program');
      console.error('Error deleting program:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (programId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPrograms(programs.map(p => 
          p.id === programId ? { ...p, status: newStatus } : p
        ));
      } else {
        alert(data.message || 'Failed to update program status');
      }
    } catch (err) {
      alert('Error updating program status');
      console.error('Error updating program status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={fetchPrograms}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Programs Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all programs displayed on the website
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/programs/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Link>
        </div>
      </div>

      {/* Programs table */}
      {programs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No programs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new program.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/programs/add"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {programs.map((program) => (
              <li key={program.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    {/* Program image */}
                    <div className="flex-shrink-0 h-16 w-16">
                      <Image
                        className="h-16 w-16 rounded-lg object-cover"
                        src={program.imageUrl}
                        alt={program.title}
                        width={64}
                        height={64}
                      />
                    </div>
                    
                    {/* Program details */}
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {program.title}
                        </h3>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          program.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {program.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {program.description}
                      </p>
                      {program.linkUrl && (
                        <div className="mt-1">
                          <a
                            href={program.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {program.linkText || 'View Link'}
                          </a>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(program.createdAt).toLocaleDateString()} • 
                        Updated: {new Date(program.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Toggle status */}
                    <button
                      onClick={() => toggleStatus(program.id, program.status)}
                      className={`p-2 rounded-full ${
                        program.status === 'active'
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={program.status === 'active' ? 'Hide program' : 'Show program'}
                    >
                      {program.status === 'active' ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Edit */}
                    <Link
                      href={`/admin/programs/${program.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                      title="Edit program"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(program.id)}
                      disabled={deletingId === program.id}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full disabled:opacity-50"
                      title="Delete program"
                    >
                      {deletingId === program.id ? (
                        <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}