import React from 'react';
import { Users, FileText, TrendingUp, Ticket, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const mockRevenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 5890 },
    { name: 'Jun', revenue: 7390 },
    { name: 'Jul', revenue: 8490 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Here is what's happening with TechSphere today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium shadow-sm transition-colors">
            View Reports
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Clients</p>
            <h3 className="text-2xl font-bold text-gray-900">128</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Subscriptions</p>
            <h3 className="text-2xl font-bold text-gray-900">94</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start gap-4">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Revenue Growth</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">+18%</h3>
              <span className="text-xs text-emerald-600 font-medium">vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Open Tickets</p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Comparison</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={288} minWidth={300}>
            <BarChart data={mockRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 14 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
