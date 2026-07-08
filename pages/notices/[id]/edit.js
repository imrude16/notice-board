import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import NoticeForm from '../../../components/NoticeForm';

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function loadNotice() {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (res.status === 404) {
          setError('Notice not found');
          return;
        }
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        setError('Failed to load notice');
      } finally {
        setLoading(false);
      }
    }

    loadNotice();
  }, [id]);

  return (
    <Layout>
      <h1 className="text-2xl font-extrabold text-[#FBF9F4] mb-4">Edit Notice</h1>
      {loading && <p className="text-[#FBF9F4]/60 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {notice && <NoticeForm initialData={notice} noticeId={notice.id} />}
    </Layout>
  );
}