'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Producto {
  id: number;
  title: string;
  description: string;
  price: string;
  price_num: number;
  category: string;
  icon: string;
  popular: boolean;
}

interface Servicio {
  id: number;
  title: string;
  description: string;
  price: string;
  price_num: number;
  category: string;
  icon: string;
}

interface Evento {
  id: number;
  title: string;
  description: string;
  date: string;
  status: string;
}

interface Pedido {
  id: number;
  customer_name: string;
  customer_email: string;
  items: any;
  total_price: number;
  status: string;
  created_at: string;
}

interface Cita {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  fecha_creacion: string;
}

type Tab = 'productos' | 'servicios' | 'eventos' | 'pedidos' | 'citas';

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('productos');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const ADMIN_PASSWORD = 'benso-admin-2024';

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    setLoading(true);
    try {
      const [prod, serv, evt, ped, cit] = await Promise.all([
        supabase.from('productos').select('*').eq('is_active', true),
        supabase.from('servicios').select('*').eq('is_active', true),
        supabase.from('eventos').select('*').eq('is_active', true),
        supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
        supabase.from('citas').select('*').order('fecha_creacion', { ascending: false })
      ]);

      if (prod.data) setProductos(prod.data);
      if (serv.data) setServicios(serv.data);
      if (evt.data) setEventos(evt.data);
      if (ped.data) setPedidos(ped.data);
      if (cit.data) setCitas(cit.data);
    } catch (e) {
      console.error('Error loading data:', e);
    }
    setLoading(false);
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPassword('');
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 15px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Admin
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem'
      }}>
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ margin: '0 0 1rem', color: '#002c6a' }}>BENSO Admin</h2>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e6e6e6',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#002c6a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'transparent',
              color: '#666',
              border: 'none',
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#f5f5f5',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: '#002c6a',
        color: '#fff',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>BENSO Admin</h1>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Salir
        </button>
      </div>

      {/* Tabs - horizontal scroll on mobile */}
      <div style={{
        display: 'flex',
        background: '#fff',
        borderBottom: '1px solid #e6e6e6',
        overflowX: 'auto',
        gap: '0.25rem'
      }}>
        {(['productos', 'servicios', 'eventos', 'pedidos', 'citas'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1rem',
              background: activeTab === tab ? '#002c6a' : 'transparent',
              color: activeTab === tab ? '#fff' : '#333',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #0056d0' : '3px solid transparent',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            {activeTab === 'productos' && (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {productos.map(p => (
                  <div key={p.id} style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{p.title}</h3>
                    <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.85rem' }}>
                      {p.description}
                    </p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#002c6a' }}>
                      {p.price} CUP{p.popular && ' - Popular'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'servicios' && (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {servicios.map(s => (
                  <div key={s.id} style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{s.title}</h3>
                    <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.85rem' }}>
                      {s.description}
                    </p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#002c6a' }}>{s.price}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'eventos' && (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {eventos.map(e => (
                  <div key={e.id} style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{e.title}</h3>
                    <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.85rem' }}>
                      {e.description}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#0056d0' }}>
                      {e.date} - {e.status}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'pedidos' && (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {pedidos.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>No hay pedidos</p>
                ) : (
                  pedidos.map(p => (
                    <div key={p.id} style={{
                      background: '#fff',
                      padding: '1rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <strong>Pedido #{p.id}</strong>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: p.status === 'completado' ? '#4CAF50' : '#FF9800',
                          color: '#fff',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {p.status}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem' }}>
                        Cliente: {p.customer_name || 'N/A'}
                      </p>
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>
                        Email: {p.customer_email || 'N/A'}
                      </p>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#002c6a' }}>
                        Total: {p.total_price?.toLocaleString()} CUP
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'citas' && (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {citas.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>No hay citas</p>
                ) : (
                  citas.map(c => (
                    <div key={c.id} style={{
                      background: '#fff',
                      padding: '1rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <strong>Cita #{c.id}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                          {new Date(c.fecha_creacion).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 0.25rem', fontWeight: 'bold', color: '#002c6a' }}>{c.nombre}</p>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#666' }}>
                        {c.email || 'N/A'} | {c.telefono}
                      </p>
                      {c.mensaje && (
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#444', whiteSpace: 'pre-wrap' }}>
                          {c.mensaje}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        X
      </button>
    </div>
  );
}
