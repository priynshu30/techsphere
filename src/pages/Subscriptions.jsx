import React from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

const mockSubscriptions = [
  { id: 'SUB-101', client: 'Acme Corp', service: 'Cloud Hosting - Enterprise', plan: '$299/mo', startDate: '2023-01-15', renewalDate: '2024-01-15', status: 'Active' },
  { id: 'SUB-102', client: 'Globex Inc.', service: 'Security Tools - Advanced', plan: '$399/mo', startDate: '2023-03-22', renewalDate: '2024-03-22', status: 'Active' },
  { id: 'SUB-103', client: 'Acme Corp', service: 'IT Monitoring', plan: '$149/mo', startDate: '2023-01-15', renewalDate: '2024-01-15', status: 'Active' },
  { id: 'SUB-104', client: 'Soylent Corp', service: 'Data Backup - Basic', plan: '$89/mo', startDate: '2022-11-05', renewalDate: '2023-11-05', status: 'Past Due' },
  { id: 'SUB-105', client: 'Initech LLC', service: 'Remote Support - Priority', plan: '$199/mo', startDate: '2023-06-10', renewalDate: '2024-06-10', status: 'Active' },
];

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-500 text-sm mt-1">Track recurring billing and service renewals.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search subscriptions..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 w-full sm:w-auto justify-center">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Sub ID</th>
                <th scope="col" className="px-6 py-4 font-medium">Client</th>
                <th scope="col" className="px-6 py-4 font-medium">Service & Plan</th>
                <th scope="col" className="px-6 py-4 font-medium">Start Date</th>
                <th scope="col" className="px-6 py-4 font-medium">Renewal Date</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {mockSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sub.id}</td>
                  <td className="px-6 py-4 font-medium text-indigo-600">{sub.client}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.service}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{sub.plan}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{sub.startDate}</td>
                  <td className="px-6 py-4 text-gray-500">{sub.renewalDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
