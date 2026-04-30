import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BENSO Admin',
  description: 'Panel de administración BENSO',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}