import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import NoticeCard from '../../components/NoticeCard';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadNotices() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/notices');
      if (!res.ok) throw new Error('Failed to load notices');
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      setError('Could not load notices. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/notices/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError('Failed to delete notice. Please try again.');
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">All Notices</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-500 text-sm">Loading notices...</p>}

      {!loading && notices.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No notices yet</p>
          <p className="text-sm">Click "+ New Notice" to add the first one.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {notices.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} onDeleteClick={setDeleteTarget} />
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this notice?"
        message={`"${deleteTarget?.title}" will be permanently deleted. This cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  );
}