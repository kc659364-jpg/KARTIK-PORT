import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream dark:bg-neutral-950 p-5 text-center transition-colors">
      <h1 className="font-display text-[clamp(4rem,10vw,8rem)] text-espresso dark:text-white mb-4 leading-none">
        404
      </h1>
      <p className="font-body text-muted-brown dark:text-gray-400 text-lg mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-espresso dark:bg-blue-600 hover:bg-caramel dark:hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}
