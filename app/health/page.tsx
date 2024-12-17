'use client';

import { useState } from 'react';

export default function HealthCheck() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/health/deep', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setStatus(JSON.stringify(data, null, 2));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '检查失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">健康检查页面</h1>
      
      <button
        onClick={checkHealth}
        disabled={loading}
        className={`px-4 py-2 rounded ${
          loading 
            ? 'bg-gray-400' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {loading ? '检查中...' : '检查健康状态'}
      </button>

      {status && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {status}
        </pre>
      )}
    </div>
  );
} 