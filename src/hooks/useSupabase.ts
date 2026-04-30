import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabaseData<T>(table: string, query?: object) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let queryBuilder = supabase.from(table).select('*');
        
        if (query) {
          if ('eq' in queryBuilder && query) {
            Object.entries(query).forEach(([key, value]) => {
              queryBuilder = queryBuilder.eq(key, value);
            });
          }
        }

        const { data: result, error: err } = await queryBuilder;
        
        if (err) throw err;
        setData(result || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table]);

  return { data, loading, error };
}

export async function savePedido(items: any[], totalPrice: number, customerName?: string, customerEmail?: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .insert([{
      items,
      total_price: totalPrice,
      customer_name: customerName,
      customer_email: customerEmail,
      status: 'pendiente'
    }])
    .select();

  return { data, error };
}
