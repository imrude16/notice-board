import Link from 'next/link';

export default function NoticeCard({ notice, onDeleteClick }) {
  const isUrgent = notice.priority === 'Urgent';
  const formattedDate = new Date(notice.publishDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3 sm:flex-row sm:items-start">
      {notice.image && (
        <img
          src={notice.image}
          alt=""
          className="w-full sm:w-32 h-32 object-cover rounded-md shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {isUrgent && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Urgent
            </span>
          )}
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {notice.category}
          </span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 wrap-break-word">{notice.title}</h3>
        <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap wrap-break-word">{notice.body}</p>
      </div>
      <div className="flex sm:flex-col gap-2 shrink-0">
        <Link
          href={`/notices/${notice.id}/edit`}
          className="text-center border border-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          onClick={() => onDeleteClick(notice)}
          className="border border-red-300 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}