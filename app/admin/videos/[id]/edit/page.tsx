'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';
import { VideoFormData } from '@/app/types/video';
import { ArrowLeft, AlertCircle } from 'lucide-react';

function parseEmbedInput(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('<')) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    if (match) return match[1];
  }
  return trimmed;
}

function isValidEmbedSrc(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.includes('facebook.com') && u.pathname.includes('plugins');
  } catch {
    return false;
  }
}

export default function EditVideo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [embedInput, setEmbedInput] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');

  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    facebookUrl: '',
    isFeatured: false,
    displayOrder: 0,
    status: 'active',
  });

  useEffect(() => {
    fetch(`/api/videos/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const v = data.data;
          setFormData({
            title: v.title,
            description: v.description || '',
            facebookUrl: v.facebookUrl,
            isFeatured: v.isFeatured,
            displayOrder: v.displayOrder,
            status: v.status,
          });
          // Pre-populate the textarea with the stored src so user can see/edit it
          setEmbedInput(v.facebookUrl);
          setPreviewSrc(v.facebookUrl);
        } else {
          setError('Video not found');
        }
      })
      .catch(() => setError('Failed to load video'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
             : name === 'displayOrder' ? parseInt(value) || 0
             : value,
    }));
  };

  const handleEmbedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmbedInput(e.target.value);
    setPreviewSrc('');
    const src = parseEmbedInput(e.target.value);
    setFormData((prev) => ({ ...prev, facebookUrl: src }));
  };

  const handlePreview = () => {
    const src = parseEmbedInput(embedInput);
    if (!isValidEmbedSrc(src)) {
      setError('Could not extract a valid Facebook embed src. Make sure you copy the full embed code from the Facebook "Embed" option.');
      return;
    }
    setError('');
    setPreviewSrc(src);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) throw new Error('Title is required');
      const src = parseEmbedInput(embedInput);
      if (!src) throw new Error('Embed code is required');
      if (!isValidEmbedSrc(src)) throw new Error('Invalid embed code. Please use the Facebook "Embed" option and copy the full iframe code.');

      const payload = { ...formData, facebookUrl: src };

      const response = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Video updated successfully!');
        setTimeout(() => router.push('/admin/videos'), 1500);
      } else {
        throw new Error(data.message || 'Failed to update video');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/videos" className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
          <p className="text-gray-600">Update Facebook video details</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Video Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="embedInput" className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Embed Code *
              </label>
              <div className="flex gap-2 items-start">
                <textarea
                  id="embedInput"
                  value={embedInput}
                  onChange={handleEmbedChange}
                  rows={4}
                  placeholder='Paste the full <iframe ...> embed code from Facebook here'
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!embedInput.trim()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  Preview
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Go to the Facebook post → ··· menu → Embed → Copy Code
              </p>
            </div>

            {previewSrc && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Embed Preview</p>
                <div className="relative w-full max-w-lg rounded-lg overflow-hidden bg-gray-100" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={previewSrc}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Feature on homepage</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-7">Featured videos appear in the Videos section on the homepage</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/videos" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
