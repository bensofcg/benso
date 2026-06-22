import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'Nosotros | BENSO',
  description: 'Conoce el Proyecto Benso: nuestra misión, visión y compromiso con la rentabilidad sostenible de emprendimientos en Cuba. Consultoría, herramientas y capacitación estratégica.',
  openGraph: {
    title: 'Nosotros | BENSO',
    description: 'Conoce el Proyecto Benso: nuestra misión y compromiso con tu emprendimiento.',
  },
};

export default function Page() {
  return <AboutPage />;
}
