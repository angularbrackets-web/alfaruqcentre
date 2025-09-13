'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { EventFormData } from '@/app/types/event';
import { ArrowLeft, Upload, X, AlertCircle, Plus, Minus, Play } from 'lucide-react';

export default function AddEvent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    registrationLink: '',
    startDate: '',
    endDate: '',
    expiryDate: '',
    summary: [''],
    tags: [],
    status: 'active',
    order: 0
  });

  // File handling
  const [selectedFiles, setSelectedFiles] = useState<{
    poster?: File;
    video?: File;
    thumbnail?: File;
  }>({});

  const [previews, setPreviews] = useState<{
    poster?: string;
    video?: string;
    thumbnail?: string;
  }>({});

  const [, setUploadedUrls] = useState<{
    poster?: string;
    video?: string;
    thumbnail?: string;
  }>({});

  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileSelect = (type: 'poster' | 'video' | 'thumbnail') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = type === 'video';
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    const allowedTypes = isVideo ? allowedVideoTypes : allowedImageTypes;

    if (!allowedTypes.includes(file.type)) {
      setError(`Please select a valid ${isVideo ? 'video' : 'image'} file`);
      return;
    }

    // Validate file size
    const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for video, 5MB for images
    if (file.size > maxSize) {
      setError(`File size must be less than ${isVideo ? '100MB' : '5MB'}`);
      return;
    }

    // Clear any previous errors
    setError('');

    // Update state
    setSelectedFiles(prev => ({ ...prev, [type]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (type: 'poster' | 'video' | 'thumbnail') => {
    const file = selectedFiles[type];
    if (!file) return null;

    const setUploading = type === 'poster' ? setIsUploadingPoster :
                        type === 'video' ? setIsUploadingVideo : setIsUploadingThumbnail;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadedUrls(prev => ({ ...prev, [type]: data.url }));
        return data.url;
      } else {
        throw new Error(data.message || `Failed to upload ${type}`);
      }
    } catch (error) {
      console.error(`Upload error for ${type}:`, error);
      setError(`Failed to upload ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (type: 'poster' | 'video' | 'thumbnail') => {
    setSelectedFiles(prev => ({ ...prev, [type]: undefined }));
    setPreviews(prev => ({ ...prev, [type]: undefined }));
    setUploadedUrls(prev => ({ ...prev, [type]: undefined }));
  };

  // Summary management
  const addSummaryPoint = () => {
    setFormData(prev => ({
      ...prev,
      summary: [...prev.summary, '']
    }));
  };

  const removeSummaryPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      summary: prev.summary.filter((_, i) => i !== index)
    }));
  };

  const updateSummaryPoint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      summary: prev.summary.map((item, i) => i === index ? value : item)
    }));
  };

  // Tag management
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Event title is required');
      }

      if (!formData.startDate || !formData.endDate || !formData.expiryDate) {
        throw new Error('All dates (start, end, expiry) are required');
      }

      // Validate date logic
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const expiryDate = new Date(formData.expiryDate);

      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }

      if (expiryDate < endDate) {
        throw new Error('Expiry date must be after end date');
      }

      // Upload files
      const posterUrl = selectedFiles.poster ? await uploadFile('poster') : null;
      const videoUrl = selectedFiles.video ? await uploadFile('video') : null;
      const thumbnailUrl = selectedFiles.thumbnail ? await uploadFile('thumbnail') : null;

      // Check for upload errors
      if ((selectedFiles.poster && !posterUrl) ||
          (selectedFiles.video && !videoUrl) ||
          (selectedFiles.thumbnail && !thumbnailUrl)) {
        throw new Error('File upload failed. Please try again.');
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        summary: formData.summary.filter(s => s.trim()),
        poster: posterUrl,
        video: videoUrl,
        thumbnail: thumbnailUrl
      };

      // Submit to API
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Event created successfully!');
        setTimeout(() => {
          router.push('/admin/events');
        }, 1500);
      } else {
        throw new Error(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/events"
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Event</h1>
          <p className="text-gray-600">Create a new community event</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={today}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || today}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={formData.endDate || today}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">When to hide this event from public view</p>
              </div>

              <div>
                <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Link
                </label>
                <input
                  type="url"
                  id="registrationLink"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
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
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first (0 for auto-assign)</p>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Poster Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Poster
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {previews.poster ? (
                    <div className="relative">
                      <Image
                        src={previews.poster}
                        alt="Event poster preview"
                        width={200}
                        height={150}
                        className="mx-auto rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('poster')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload poster</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect('poster')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {isUploadingPoster && (
                  <p className="text-sm text-blue-600 mt-2">Uploading poster...</p>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Video
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {previews.video ? (
                    <div className="relative">
                      <div className="bg-gray-100 rounded-md p-4">
                        <Play className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 truncate">{selectedFiles.video?.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('video')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Play className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload video</p>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect('video')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {isUploadingVideo && (
                  <p className="text-sm text-blue-600 mt-2">Uploading video...</p>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {previews.thumbnail ? (
                    <div className="relative">
                      <Image
                        src={previews.thumbnail}
                        alt="Video thumbnail preview"
                        width={200}
                        height={150}
                        className="mx-auto rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('thumbnail')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload thumbnail</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect('thumbnail')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {isUploadingThumbnail && (
                  <p className="text-sm text-blue-600 mt-2">Uploading thumbnail...</p>
                )}
              </div>
            </div>
          </div>

          {/* Summary Points */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Summary Points</h2>
            <div className="space-y-3">
              {formData.summary.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={point}
                    onChange={(e) => updateSummaryPoint(index, e.target.value)}
                    placeholder={`Summary point ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  {formData.summary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSummaryPoint(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSummaryPoint}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Summary Point
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!currentTag.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/events"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingPoster || isUploadingVideo || isUploadingThumbnail}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}