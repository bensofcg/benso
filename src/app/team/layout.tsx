import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '../admin/admin.css';
import './team.css';

export const metadata: Metadata = {
  title: 'BENSO Team',
  description: 'Panel de gestión del equipo BENSO',
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="bottom-left" toastOptions={{ duration: 3000 }} />
      {children}
    </>
  );
}
