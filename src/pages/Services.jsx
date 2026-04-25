import React, { useState } from 'react';
import { Plus, Cloud, Shield, Database, LayoutTemplate, Headset, Activity, Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import api from '../api/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const ICON_MAP = { Cloud, Activity, Shield, Database, LayoutTemplate, Headset };
const ICON_COLORS = ['text-blue-600 bg-blue-100', 'text-indigo-600 bg-indigo-100', 'text-rose-600 bg-rose-100', 'text-amber-600 bg-amber-100', 'text-emerald-600 bg-emerald-100', 'text-purple-600 bg-purple-100'];
const ICONS = Object.keys(ICON_MAP);
const EMPTY_FORM = { name: '', description: '', price: '', activeStatus: true };

export default function Services() {
  const { isAdmin } = useAuth();
  const { data, loading, error, refetch } = useFetch('/services');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const services = data?.data || [];

  const openAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setFormError(''); setModalOpen(true); };
  const openEdit = (s) => { setEditTarget(s); setForm({ name: s.name, description: s.description, price: s.price, activeStatus: s.activeStatus }); setFormError(''); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editTarget) {
        await api.put(`/services/${editTarget._id}`, payload);
      } else {
        await api.post('/services', payload);
      }
      await refetch();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await api.delete(`/services/${id}`); await refetch(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and provision IT services to your clients.</p>
        </div>
        {isAdmin() && (
          <button onClick={openAdd} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap">
            <Plus className="h-4 w-4" /> Add Service
          </button>
        )}
      </div>

      {loading ? <Spinner label="Loading services..." /> : error ? <ErrorMessage message={error} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center py-10">No services found. {isAdmin() && 'Add your first service.'}</p>
          ) : services.map((service, idx) => {
            const colorClass = ICON_COLORS[idx % ICON_COLORS.length];
            const [textColor, bgColor] = colorClass.split(' ');
            const IconComponent = ICON_MAP[ICONS[idx % ICONS.length]];
            return (
              <div key={service._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${bgColor} ${textColor} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${service.activeStatus ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {service.activeStatus ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm flex-grow mb-6 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-900">${Number(service.price).toLocaleString()}/mo</span>
                  {isAdmin() && (
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(service)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(service._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 sm:p-0">
            <div className="fixed inset-0 bg-gray-900/75" onClick={closeModal} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 z-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">{editTarget ? 'Edit Service' : 'Add New Service'}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500"><X className="h-6 w-6" /></button>
              </div>
              {formError && <div className="mb-4"><ErrorMessage message={formError} onDismiss={() => setFormError('')} /></div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Cloud Hosting" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="3" required value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the service..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($/mo)</label>
                    <input type="number" required min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="299" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={form.activeStatus} onChange={(e) => setForm(f => ({ ...f, activeStatus: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2">
                    {submitting && <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    {editTarget ? 'Save Changes' : 'Add Service'}
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
