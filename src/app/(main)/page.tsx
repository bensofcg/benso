import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'BENSO | Consultoría y Soluciones Digitales para PyMEs',
  description: 'Asesoramiento, herramientas y capacitación estratégica para impulsar la rentabilidad de tu emprendimiento. Contabilidad, marketing digital y automatización en Cuba.',
  openGraph: {
    title: 'BENSO | Consultoría y Soluciones Digitales para PyMEs',
    description: 'Asesoramiento, herramientas y capacitación estratégica para impulsar la rentabilidad de tu emprendimiento.',
  },
};

export default function Page() {
  return <HomePage />;
}
