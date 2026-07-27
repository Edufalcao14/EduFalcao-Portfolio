'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="h-screen flex flex-col items-center justify-center gap-6 px-6">
      <span className="font-mono text-sm text-emerald-400">.../error</span>
      <h2 className="font-mono font-bold text-3xl text-white">Something went wrong</h2>
      <p className="text-gray-400 text-center max-w-[400px] text-sm">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <div className="flex gap-6">
        <button
          onClick={reset}
          className="font-mono text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
        >
          Try again
        </button>
        <Link
          href="/"
          className="font-mono text-gray-400 hover:text-gray-300 transition-colors text-sm"
        >
          Go home
        </Link>
      </div>
    </section>
  )
}
