import ApiDocumentation from '@/components/api-docs/ApiDocumentation';

export const metadata = {
  title: 'API Documentation | Library Management System',
  description: 'API documentation for the Library Management System',
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Library Management System API Documentation
        </h1>
        <ApiDocumentation />
      </div>
    </div>
  );
}
