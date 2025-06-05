'use client';

export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">NEXT_PUBLIC_SUPABASE_URL:</h2>
          <p className="break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h2>
          <p className="break-all">
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
              ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
              : 'Not set'}
          </p>
        </div>
      </div>
    </div>
  );
}
