import type { Metadata } from 'next';
import { ProductsPage } from '@/components/pages/ProductsPage';

export const metadata: Metadata = {
  title: 'Productos | BENSO',
  description: 'Soluciones digitales y productos para potenciar tu negocio: pegatinas, posters, cuadros, tarjetas y más. Calidad y diseño profesional para emprendimientos.',
  openGraph: {
    title: 'Productos | BENSO',
    description: 'Soluciones digitales y productos para potenciar tu negocio con diseño profesional.',
  },
};

export default function Page() {
  return <ProductsPage />;
}
