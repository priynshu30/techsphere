import React, { useState } from 'react';
import { Plus, Filter, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import api from '../api/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_STYLES = {
  'Open': 'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Resolved': 'bg-green-100 text-green-700',
};

export default function Tickets() {
  const { isAdmin } = useAuth();
  const { data, loading, error, refetch } = useFetch('/tickets');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const tickets = data?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/tickets', form);
      await refetch();
      setModalOpen(false);
      setForm({ title: '', description: '' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/tickets/${id}`, { status });
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket?')) return;
    try { await api.delete(`/tickets/${id}`); await refetch(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage infrastructure, security, and client requests.</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap">
          <Plus className="h-4 w-4" /> Submit Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? <Spinner label="Loading tickets..." /> : error ? (
          <div className="p-6"><ErrorMessage message={error} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Ticket ID</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Submitted By</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  {isAdmin() && <th className="px-6 py-4 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {tickets.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">No tickets found.</td></tr>
                ) : tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap font-mono text-xs">
                      {ticket._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-indigo-600 max-w-xs truncate">{ticket.title}</td>
                    <td className="px-6 py-4">{ticket.userId?.name || '—'}</td>
                    <td className="px-6 py-4">
                      {isAdmin() ? (
                        <div className="relative">
                          <select
                            value={ticket.status}
                            disabled={updatingId === ticket._id}
                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                            className={`appearance-none px-3 py-1 pr-7 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${STATUS_STYLES[ticket.status]}`}
                          >
                            {['Open', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}
                          </select>
                          {updatingId === ticket._id && (
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 border border-current border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      ) : (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[ticket.status]}`}>
                          {ticket.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    {isAdmin() && (
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(ticket._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Ticket Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 sm:p-0">
            <div className="fixed inset-0 bg-gray-900/75" onClick={() => setModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 z-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">Submit New Ticket</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500"><X className="h-6 w-6" /></button>
              </div>
              {formError && <div className="mb-4"><ErrorMessage message={formError} onDismiss={() => setFormError('')} /></div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Title</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Server unreachable, SSL expired"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="4" required value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Provide detailed information about the issue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2">
                    {submitting && <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
