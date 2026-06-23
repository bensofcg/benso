import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

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

async function fetchProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('is_active', true)
    .order('popular', { ascending: false });

  if (error) throw error;
  return (data || []) as Producto[];
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
  const { data, error, isLoading } = useSWR(PRODUCTOS_KEY, fetchProductos, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return {
    productos: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}

export function useServicios() {
  const { data, error, isLoading } = useSWR(SERVICIOS_KEY, fetchServicios, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return {
    servicios: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}

export function useEventos() {
  const { data, error, isLoading } = useSWR(EVENTOS_KEY, fetchEventos, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return {
    eventos: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}
