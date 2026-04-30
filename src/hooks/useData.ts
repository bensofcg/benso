import { useState, useEffect } from 'react';
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

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('is_active', true)
          .order('popular', { ascending: false });

        if (error) throw error;
        setProductos(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  return { productos, loading, error };
}

export function useServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServicios() {
      try {
        const { data, error } = await supabase
          .from('servicios')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        setServicios(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServicios();
  }, []);

  return { servicios, loading, error };
}

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEventos(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEventos();
  }, []);

  return { eventos, loading, error };
}
