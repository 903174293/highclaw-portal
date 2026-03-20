import Image from 'next/image';
import Link from 'next/link';

import { envConfigs } from '@/config';
import { Button } from '@/shared/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-[#0a0a0f] px-4">
      <Image
        src={envConfigs.app_logo}
        alt={envConfigs.app_name}
        width={64}
        height={64}
      />

      {/* Terminal-style 404 */}
      <div className="text-center">
        <div className="inline-block px-6 py-4 rounded-xl bg-[#0d1117] border border-[#1e1e2e] mb-6">
          <pre className="font-mono text-sm text-[#64748b]">
            <span className="text-[#ef4444]">Error</span> <span className="text-[#f8fafc] text-5xl font-bold block my-2">404</span>
            <span className="text-[#6b7280]">// page not found</span>
          </pre>
        </div>

        <h1 className="text-xl font-semibold text-[#f8fafc] mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[#94a3b8] mb-8">
          Looks like this agent hasn&apos;t been deployed yet.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button asChild className="hc-btn-primary border-0 px-6 py-2.5 rounded-lg">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="hc-btn-ghost px-6 py-2.5 rounded-lg">
          <Link href="/docs">
            View Tutorials
          </Link>
        </Button>
      </div>

      <a
        href="https://github.com/903174293/highclaw/issues"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors mt-2"
      >
        Report on GitHub →
      </a>
    </div>
  );
}
