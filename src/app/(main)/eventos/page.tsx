import type { Metadata } from 'next';
import { EventsPage } from '@/components/pages/EventsPage';

export const metadata: Metadata = {
  title: 'Eventos | BENSO',
  description: 'Próximos eventos, talleres y capacitaciones para emprendedores. Mantente al día con las últimas tendencias en negocios y marketing digital.',
  openGraph: {
    title: 'Eventos | BENSO',
    description: 'Próximos eventos, talleres y capacitaciones para emprendedores en Cuba.',
  },
};

export default function Page() {
  return <EventsPage />;
}
