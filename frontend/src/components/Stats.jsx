import React from 'react';

const statsData = [
  { id: 1, name: 'Total Users', value: '12,345', change: '+12%', isPositive: true },
  { id: 2, name: 'Active Sessions', value: '1,234', change: '+5%', isPositive: true },
  { id: 3, name: 'Conversion Rate', value: '3.2%', change: '-0.4%', isPositive: false },
  { id: 4, name: 'Total Revenue', value: '$45,678', change: '+18%', isPositive: true },
];

export default function Stats() {
  return (
    <div className="bg-white py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-gray-50 px-4 pt-5 pb-6 shadow-sm border border-gray-100 sm:px-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight text-gray-900">
                {item.value}
              </span>
              <span
                className={`inline-flex items-baseline text-sm font-semibold ${
                  item.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}