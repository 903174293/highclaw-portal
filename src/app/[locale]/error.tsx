'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-[#0a0a0f] px-4">
      <Image
        src="/highclaw.png"
        alt="HighClaw"
        width={64}
        height={64}
      />

      {/* Terminal-style error */}
      <div className="text-center">
        <div className="inline-block px-6 py-4 rounded-xl bg-[#0d1117] border border-[#1e1e2e] mb-6">
          <pre className="font-mono text-sm text-[#64748b]">
            <span className="text-[#f59e0b]">Error</span> <span className="text-[#f8fafc] text-5xl font-bold block my-2">500</span>
            <span className="text-[#6b7280]">// something went wrong</span>
          </pre>
        </div>

        <h1 className="text-xl font-semibold text-[#f8fafc] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-[#94a3b8] mb-8">
          Our agents are looking into it.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={reset}
          className="hc-btn-primary border-0 px-6 py-2.5 rounded-lg"
        >
          Try Again
        </Button>
        <Button asChild variant="outline" className="hc-btn-ghost px-6 py-2.5 rounded-lg">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
