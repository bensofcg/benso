import type { Metadata } from 'next';
import { ServicesPage } from '@/components/pages/ServicesPage';

export const metadata: Metadata = {
  title: 'Servicios | BENSO',
  description: 'Consultoría empresarial, capacitación estratégica y herramientas digitales para PyMEs. Impulsa tu negocio con asesoría profesional en contabilidad, marketing y automatización.',
  openGraph: {
    title: 'Servicios | BENSO',
    description: 'Consultoría empresarial, capacitación estratégica y herramientas digitales para PyMEs.',
  },
};

export default function Page() {
  return <ServicesPage />;
}
