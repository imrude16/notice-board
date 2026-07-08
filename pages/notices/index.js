import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import NoticeCard from '../../components/NoticeCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';
import { CATEGORIES } from '../../lib/constants';

const FILTERS = ['All', ...CATEGORIES];

function SkeletonCard() {
  return <div className="bg-[#FBF9F4]/30 rounded-md h-28 animate-pulse" />;
}

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    if (!router.isReady) return;
    const { toast: toastType, ...rest } = router.query;
    if (toastType === 'created') setToast({ message: 'Notice published', type: 'success' });
    if (toastType === 'updated') setToast({ message: 'Notice updated', type: 'success' });
    if (toastType) {
      router.replace({ pathname: '/notices', query: rest }, undefined, { shallow: true });
    }
  }, [router.isReady]);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/notices/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
      setToast({ message: 'Notice deleted', type: 'success' });
    } catch (err) {
      setError('Failed to delete notice. Please try again.');
      setToast({ message: 'Failed to delete notice', type: 'error' });
    }
  }

  const filteredNotices =
    activeFilter === 'All' ? notices : notices.filter((n) => n.category === activeFilter);
  const urgentCount = filteredNotices.filter((n) => n.priority === 'Urgent').length;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-extrabold text-[#FBF9F4]">All Notices</h1>
        {!loading && !error && (
          <p className="text-sm text-[#FBF9F4]/60">
            {filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''}
            {urgentCount > 0 && ` · ${urgentCount} urgent`}
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === f
                ? 'bg-[#D9A441] border-[#D9A441] text-[#17242A]'
                : 'border-[#FBF9F4]/20 text-[#FBF9F4]/70 hover:bg-[#FBF9F4]/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && filteredNotices.length === 0 && !error && (
        <div className="text-center py-16 text-[#FBF9F4]/50">
          <p className="text-lg">
            {activeFilter === 'All' ? 'No notices yet' : `No ${activeFilter} notices`}
          </p>
          <p className="text-sm">Click "+ New Notice" to add one.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredNotices.map((notice) => (
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

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
    </Layout>
  );
}