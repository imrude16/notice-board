import Layout from '../../components/Layout';
import NoticeForm from '../../components/NoticeForm';

export default function NewNoticePage() {
  return (
    <Layout>
      <h1 className="text-2xl font-extrabold text-[#FBF9F4] mb-4">New Notice</h1>
      <NoticeForm />
    </Layout>
  );
}