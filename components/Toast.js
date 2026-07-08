import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const bg = type === 'error' ? 'bg-red-600' : 'bg-[#5FA88C]';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 ${bg} text-white text-sm font-medium px-4 py-2.5 rounded-md shadow-lg z-50`}
    >
      {message}
    </div>
  );
}