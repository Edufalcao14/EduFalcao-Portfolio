import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="h-screen flex flex-col items-center justify-center gap-6 px-6">
      <span className="font-mono text-sm text-emerald-400">.../404</span>
      <h2 className="font-mono font-bold text-3xl text-white">Page not found</h2>
      <p className="text-gray-400 text-center max-w-[400px] text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="font-mono text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
      >
        Go back home
      </Link>
    </section>
  )
}
