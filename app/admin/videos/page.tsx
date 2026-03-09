'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VideoPost } from '@/app/types/video';
import { Plus, Edit2, Trash2, Play, Star, StarOff } from 'lucide-react';

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos?includeInactive=true');
      const data = await response.json();
      if (data.success) {
        setVideos(data.data);
      } else {
        setError(data.message || 'Failed to fetch videos');
      }
    } catch {
      setError('Network error while fetching videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) return;
    try {
      const response = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setVideos(videos.filter((v) => v.id !== id));
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch {
      alert('Network error while deleting video');
    }
  };

  const handleToggleFeatured = async (video: VideoPost) => {
    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !video.isFeatured }),
      });
      const data = await response.json();
      if (data.success) {
        setVideos(videos.map((v) => (v.id === video.id ? data.data : v)));
      }
    } catch {
      alert('Failed to update featured status');
    }
  };

  const handleToggleStatus = async (video: VideoPost) => {
    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: video.status === 'active' ? 'inactive' : 'active' }),
      });
      const data = await response.json();
      if (data.success) {
        setVideos(videos.map((v) => (v.id === video.id ? data.data : v)));
      }
    } catch {
      alert('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos Management</h1>
          <p className="text-gray-600">Manage Facebook videos shown on the website</p>
        </div>
        <Link
          href="/admin/videos/add"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Video
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
      )}

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
        <strong>Featured videos</strong> (starred) appear on the homepage. All active videos appear on the{' '}
        <a href="/videos" target="_blank" className="underline">Videos page</a>.
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {videos.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">No videos yet</p>
            <p className="mb-4">Add your first Facebook video to get started.</p>
            <Link
              href="/admin/videos/add"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Video
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Play className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{video.title}</p>
                          {video.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">{video.description}</p>
                          )}
                          <a
                            href={video.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline truncate block max-w-xs"
                          >
                            {video.facebookUrl}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{video.displayOrder}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(video)}
                        title={video.isFeatured ? 'Remove from homepage' : 'Show on homepage'}
                        className={`p-1.5 rounded transition-colors ${
                          video.isFeatured
                            ? 'text-yellow-500 hover:bg-yellow-50'
                            : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                        }`}
                      >
                        {video.isFeatured ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(video)}
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer ${
                          video.status === 'active'
                            ? 'text-green-700 bg-green-100 hover:bg-green-200'
                            : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {video.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/videos/${video.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(video.id)}
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
      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
            <div className="text-sm text-gray-600">Total Videos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-500">{videos.filter((v) => v.isFeatured).length}</div>
            <div className="text-sm text-gray-600">Featured on Homepage</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{videos.filter((v) => v.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Videos</div>
          </div>
        </div>
      )}
    </div>
  );
}
