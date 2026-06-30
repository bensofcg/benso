import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '../admin/admin.css';
import './team.css';
import { TeamAuthProvider } from '@/context/TeamAuthContext';

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
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <TeamAuthProvider>
        {children}
      </TeamAuthProvider>
    </>
  );
}
