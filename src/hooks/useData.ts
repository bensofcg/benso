import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

export interface Variant {
  label: string;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface Producto {
  id: number;
  title: string;
  description: string;
  price: string;
  price_num: number;
  category: string;
  icon: string;
  image: string;
  popular: boolean;
  whatsapp_link: string;
  is_active: boolean;
  variants: Variant[];
}

export interface Servicio {
  id: number;
  title: string;
  description: string;
  price: string;
  price_num: number;
  category: string;
  icon: string;
  image: string;
  popular: boolean;
  whatsapp_link: string;
  is_active: boolean;
}

export interface Evento {
  id: number;
  title: string;
  description: string;
  date: string;
  status: string;
  whatsapp_link: string;
  is_active: boolean;
}

const PRODUCTOS_KEY = 'productos';
const SERVICIOS_KEY = 'servicios';
const EVENTOS_KEY = 'eventos';

function mapVariants(product: any): Producto {
  if (product.variants && Array.isArray(product.variants)) {
    product.variants = product.variants.map((v: any) => ({
      label: v.label,
      unitPrice: v.unit_price ?? v.unitPrice,
      totalPrice: v.total_price ?? v.totalPrice,
      description: v.description,
    }));
  }
  return product as Producto;
}

async function fetchProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('is_active', true)
    .order('popular', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapVariants);
}

async function fetchServicios() {
  const { data, error } = await supabase
    .from('servicios')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as Servicio[];
}

async function fetchEventos() {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Evento[];
}

export function useProductos() {
  const { data, error, isLoading, isValidating } = useSWR(PRODUCTOS_KEY, fetchProductos, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    dedupingInterval: 30_000,
  });

  return {
    productos: data ?? [],
    loading: isLoading || isValidating,
    error: error?.message ?? null,
  };
}

export function useServicios() {
  const { data, error, isLoading, isValidating } = useSWR(SERVICIOS_KEY, fetchServicios, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    dedupingInterval: 30_000,
  });

  return {
    servicios: data ?? [],
    loading: isLoading || isValidating,
    error: error?.message ?? null,
  };
}

export function useEventos() {
  const { data, error, isLoading, isValidating } = useSWR(EVENTOS_KEY, fetchEventos, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    dedupingInterval: 30_000,
  });

  return {
    eventos: data ?? [],
    loading: isLoading || isValidating,
    error: error?.message ?? null,
  };
}
