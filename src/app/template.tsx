'use client';

import { PageLoader } from '@/components/PageLoader';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      {children}
    </>
  );
}