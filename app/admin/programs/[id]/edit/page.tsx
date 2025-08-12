'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Program, ProgramFormData } from '@/app/types/program';
import { ArrowLeft, Upload, X, AlertCircle, Loader } from 'lucide-react';

interface EditProgramProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProgram({ params }: EditProgramProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Program data
  const [program, setProgram] = useState<Program | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    linkUrl: '',
    linkText: '',
    status: 'active',
    order: 0
  });
  
  // Image handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  // Load existing program data
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await fetch(`/api/programs/${resolvedParams.id}`);
        const data = await response.json();

        if (data.success) {
          const programData = data.data;
          setProgram(programData);
          setFormData({
            title: programData.title,
            description: programData.description || '',
            linkUrl: programData.linkUrl || '',
            linkText: programData.linkText || '',
            status: programData.status,
            order: programData.order
          });
          setCurrentImageUrl(programData.imageUrl);
        } else {
          setError(data.message || 'Program not found');
        }
      } catch (err) {
        setError('Error loading program');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedImageUrl(data.url);
        setSuccess('Image uploaded successfully!');
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Program title is required');
      setIsSubmitting(false);
      return;
    }

    // Use uploaded image if available, otherwise keep current image
    const imageUrl = uploadedImageUrl || currentImageUrl;
    if (!imageUrl) {
      setError('Program must have an image');
      setIsSubmitting(false);
      return;
    }

    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/programs/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Program updated successfully!');
        setTimeout(() => {
          router.push('/admin/programs');
        }, 1500);
      } else {
        setError(data.message || 'Failed to update program');
      }
    } catch (err) {
      setError('Error updating program. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearNewImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading program...</p>
        </div>
      </div>
    );
  }

  if (error && !program) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <Link href="/admin/programs" className="mt-2 text-sm underline hover:no-underline">
          Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/admin/programs"
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Edit Program
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update program information and settings
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Program Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Summer Camp 2025"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the program..."
              />
            </div>

            <div>
              <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Registration/Info Link
              </label>
              <input
                type="url"
                name="linkUrl"
                id="linkUrl"
                value={formData.linkUrl}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="linkText" className="block text-sm font-medium text-gray-700 mb-2">
                Link Button Text
              </label>
              <input
                type="text"
                name="linkText"
                id="linkText"
                value={formData.linkText}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Register, Learn More"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active (Visible on website)</option>
                <option value="inactive">Inactive (Hidden from website)</option>
              </select>
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                id="order"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500">Lower numbers appear first</p>
            </div>
          </div>

          {/* Current Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <div className="mb-4">
              <Image
                src={currentImageUrl}
                alt={formData.title}
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          </div>

          {/* Upload New Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Image (Optional)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to select a new image
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="mt-1 text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* New Image Preview */}
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="New image preview"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearNewImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Upload Button */}
                {!uploadedImageUrl && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Image
                      </>
                    )}
                  </button>
                )}

                {uploadedImageUrl && (
                  <div className="text-green-600 text-sm flex items-center">
                    ✓ New image uploaded successfully (will replace current image when saved)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              href="/admin/programs"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2" />
                  Updating Program...
                </>
              ) : (
                'Update Program'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}