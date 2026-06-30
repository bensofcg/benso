'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Loader } from 'lucide-react';
import { useTeamAuth } from '@/context/TeamAuthContext';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { session, profile, loading } = useTeamAuth();
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  // Detect login page by layout segment (robust for any trailing slash config)
  const isLoginPage = segment === 'login';
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      if (!isLoginPage && !hasRedirected.current) {
        hasRedirected.current = true;
        router.push('/team/login');
      }
      return;
    }

    if (!profile) {
      toast.error('Usuario sin perfil de equipo');
      router.push('/team/login');
    }
  }, [session, profile, loading, router, isLoginPage]);

  // Don't block the login page — let it render
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="team-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader size={24} />
        </motion.div>
        <span>Cargando sesión…</span>
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return <>{children}</>;
}
