'use client';

import { useState } from 'react';
import EndpointSection from './EndpointSection';
import { apiData } from './apiData';

export default function ApiDocumentation() {
  const [activeSection, setActiveSection] = useState('authentication');

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:w-1/4">
        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
          <h2 className="text-lg font-semibold mb-4">API Sections</h2>
          <nav className="space-y-2">
            {Object.entries(apiData).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeSection === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:w-3/4">
        <div className="space-y-8">
          {/* Base URL Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Base URL</h2>
            <div className="bg-gray-100 p-3 rounded-md">
              <code className="text-sm">/api</code>
            </div>
          </div>

          {/* Authentication Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-700 mb-3">
              Most endpoints require JWT authentication via Bearer token in the Authorization header:
            </p>
            <div className="bg-gray-100 p-3 rounded-md">
              <code className="text-sm">Authorization: Bearer &lt;token&gt;</code>
            </div>
          </div>

          {/* Active Section Content */}
          <EndpointSection
            title={apiData[activeSection].title}
            endpoints={apiData[activeSection].endpoints}
          />
        </div>
      </div>
    </div>
  );
}
