import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#1F2E35]">
      <header className="bg-[#17242A] border-b border-black/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/notices" className="text-xl font-extrabold text-[#FBF9F4] tracking-tight">
            📌 Notice Board
          </Link>
          <Link
            href="/notices/new"
            className="bg-[#D9A441] text-[#17242A] px-4 py-2 rounded-md text-sm font-bold hover:brightness-110"
          >
            + New Notice
          </Link>
        </div>
      </header>
      <main
        className="flex-1 w-full"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <div className="max-w-5xl mx-auto w-full px-4 py-6">{children}</div>
      </main>
    </div>
  );
}