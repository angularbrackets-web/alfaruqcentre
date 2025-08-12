'use client';

import Link from 'next/link';
import { FileText, Plus, TrendingUp, Image, ImagePlus } from 'lucide-react';

const stats = [
  { name: 'Total Programs', value: '4', icon: FileText },
  { name: 'Active Programs', value: '4', icon: TrendingUp },
  { name: 'Hero Slides', value: '0', icon: Image },
];

const quickActions = [
  {
    name: 'Add Hero Slide',
    description: 'Create a new hero slideshow image',
    href: '/admin/slides/add',
    icon: ImagePlus,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    name: 'Manage Hero Slides',
    description: 'Edit homepage slideshow content',
    href: '/admin/slides',
    icon: Image,
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    name: 'Add New Program',
    description: 'Create a new program with image upload',
    href: '/admin/programs/add',
    icon: Plus,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: 'Manage Programs',
    description: 'View and edit existing programs',
    href: '/admin/programs',
    icon: FileText,
    color: 'bg-green-500 hover:bg-green-600'
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Al-Faruq Islamic Centre website content
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div>
                  <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {action.name}
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Getting Started
            </h3>
            <div className="prose text-sm text-gray-500">
              <ul className="space-y-2">
                <li>• Use the navigation menu to manage hero slides and programs</li>
                <li>• Upload high-quality images for better engagement</li>
                <li>• Keep descriptions clear and informative</li>
                <li>• Set appropriate display durations for slideshow content</li>
                <li>• Test changes on the public site after making updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}