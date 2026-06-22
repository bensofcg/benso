'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Package, Calendar, Tag, Wrench, CalendarDays, 
  ChevronRight, ChevronDown, Search, Plus, Check, X,
  Edit2, Save, Trash2, Copy, ExternalLink, Loader,
  Clock, Mail, Phone, MapPin, User, Box, TrendingUp,
  Eye, EyeOff
} from 'lucide-react';

interface Producto {
  id: number;
  title: string;
  description: string;
  price: string;
  price_num: number;
  category: string;
  icon: string;
  popular: boolean;
  is_active: boolean;
}

interface Servicio {
  id: number;
  title: string;
  description: string;
  price: string;
  price_num: number;
  category: string;
  icon: string;
  popular: boolean;
  is_active: boolean;
}

interface Evento {
  id: number;
  title: string;
  description: string;
  date: string;
  status: string;
  is_active: boolean;
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

const ADMIN_PASSWORD = 'benso-admin-2024';
const PRODUCT_CATEGORIES = ['pegatinas', 'posters', 'cuadros', 'tarjetas', 'lonas', 'otros'];
const SERVICE_CATEGORIES = ['consultoria', 'herramientas', 'capacitacion'];

function extractNumberFromPrice(price: string): number {
  const match = price.match(/[\d,.]+/);
  if (match) {
    const numStr = match[0].replace(/,/g, '');
    return parseFloat(numStr) || 0;
  }
  return 0;
}

function formatId(id: number): string {
  return String(id).padStart(3, '0');
}

const COLUMN_DEFAULTS: Record<string, number> = {
  id: 70, acciones: 100, popular: 80, estado: 130,
  precio: 120, fecha: 120, contactos: 200, items: 220,
  total: 110, cliente: 150, nombre: 150, titulo: 200,
  desc: 250, mensaje: 250, msj: 250,
};

function getColWidth(key: string, overrides: Record<string, number>): number {
  if (overrides[key]) return overrides[key];
  const suffix = key.split('-').pop() || '';
  return COLUMN_DEFAULTS[suffix] ?? 150;
}

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'pedidos' | 'citas' | 'productos' | 'servicios' | 'eventos'>('productos');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTable, setCreateTable] = useState<'productos' | 'servicios' | 'eventos'>('productos');
  const [createData, setCreateData] = useState({title: '', description: '', price: '', category: '', icon: '', popular: false, whatsapp_link: '', date: '', status: 'Proximamente'});
  const [showInactive, setShowInactive] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const resizeRef = useRef<{ col: string; startX: number; startW: number } | null>(null);
  const mouseMoveRef = useRef<((ev: MouseEvent) => void) | null>(null);
  const mouseUpRef = useRef<((ev: MouseEvent) => void) | null>(null);

  function handleColResizeStart(col: string, e: React.MouseEvent) {
    e.preventDefault();

    // Clean up any stale listeners from a previous incomplete drag
    if (mouseMoveRef.current) document.removeEventListener('mousemove', mouseMoveRef.current);
    if (mouseUpRef.current) document.removeEventListener('mouseup', mouseUpRef.current);

    const th = (e.target as HTMLElement).closest('th');
    if (!th) return;
    const startW = th.offsetWidth;
    resizeRef.current = { col, startX: e.clientX, startW };

    const handleMouseMove = (ev: MouseEvent) => {
      const r = resizeRef.current;
      if (!r) return;
      const diff = ev.clientX - r.startX;
      const newW = Math.max(50, r.startW + diff);
      setColWidths(prev => ({ ...prev, [r.col]: newW }));
      document.body.style.cursor = 'col-resize';
    };

    const handleMouseUp = () => {
      mouseMoveRef.current = null;
      mouseUpRef.current = null;
      resizeRef.current = null;
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    mouseMoveRef.current = handleMouseMove;
    mouseUpRef.current = handleMouseUp;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function ColResizeHandle({ col }: { col: string }) {
    return (
      <span
        className="col-resize-handle"
        onMouseDown={(e) => handleColResizeStart(col, e)}
      />
    );
  }

  function toggleCell(key: string) {
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function TruncatedCell({ text, cellKey, maxChars = 100 }: { text: string; cellKey: string; maxChars?: number }) {
    const isExpanded = expandedCells[cellKey];
    const shouldTruncate = text && text.length > maxChars;
    const display = shouldTruncate && !isExpanded ? text.slice(0, maxChars) + '...' : text;
    return (
      <div>
        <span>{display || '-'}</span>
        {shouldTruncate && (
          <button onClick={() => toggleCell(cellKey)} className="expand-toggle">
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>
    );
  }

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  async function loadData() {
    setLoading(true);
    try {
      const [prod, serv, evt, ped, cit] = await Promise.all([
        supabase.from('productos').select('*').order('id'),
        supabase.from('servicios').select('*').order('id'),
        supabase.from('eventos').select('*').order('id'),
        supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
        supabase.from('citas').select('*').order('fecha_creacion', { ascending: false })
      ]);
      if (prod.data) setProductos(prod.data);
      if (serv.data) setServicios(serv.data);
      if (evt.data) setEventos(evt.data);
      if (ped.data) setPedidos(ped.data);
      if (cit.data) setCitas(cit.data);
    } catch (e) { console.error('Error loading:', e); }
    setLoading(false);
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    router.push('/');
  }

  async function updateStatus(id: number, newStatus: string) {
    await supabase.from('pedidos').update({ status: newStatus }).eq('id', id);
    loadData();
  }

  async function saveEdit(table: string) {
    if (!editData) return;
    const priceNum = extractNumberFromPrice(editData.price);
    const updateData = { ...editData, price_num: priceNum };

    // Optimistic: update local state immediately
    const setter = table === 'productos' ? setProductos : table === 'servicios' ? setServicios : setEventos;
    setter((prev: any[]) => prev.map(item => item.id === editingId ? { ...item, ...updateData } : item));
    setEditingId(null);
    setEditData(null);
    toast.success('Guardado');

    // Background sync
    const { error } = await supabase.from(table).update(updateData).eq('id', editingId);
    if (error) {
      toast.error('Error: ' + error.message);
      loadData(); // Revert by reloading
    }
  }

  function startEdit(item: any, table: string) {
    setEditingId(item.id);
    setEditData({ ...item });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData(null);
  }

  async function handleCreate() {
    if (!createData.title.trim() || !createData.price.trim()) {
      toast.error('Título y Precio son obligatorios');
      return;
    }
    const data: any = {
      title: createData.title,
      description: createData.description || '',
      price: createData.price,
      price_num: extractNumberFromPrice(createData.price),
      whatsapp_link: createData.whatsapp_link || `https://wa.me/5355609099?text=Quiero%20solicitar%20el%20${encodeURIComponent(createData.title)}`,
    };
    if (createTable !== 'eventos') {
      data.category = createData.category || 'otros';
      data.icon = createData.icon || 'box';
      data.popular = createData.popular;
      data.price_type = createData.price.toLowerCase().includes('desde') ? 'desde' : 'fijo';
    }
    if (createTable === 'eventos') {
      data.date = createData.date || '';
      data.status = createData.status || 'Proximamente';
    }
    try {
      const { error } = await supabase.from(createTable).insert(data);
      if (error) { toast.error('Error: ' + error.message); return; }
      toast.success('Creado');
      setShowCreateModal(false);
      setCreateData({title: '', description: '', price: '', category: '', icon: '', popular: false, whatsapp_link: '', date: '', status: 'Proximamente'});
      loadData();
    } catch (e) {
      toast.error('Error al guardar');
    }
  }

  async function toggleActive(table: string, item: any) {
    const action = item.is_active ? 'Desactivar' : 'Activar';
    if (!window.confirm(`¿${action} "${item.title}"?`)) return;

    // Optimistic
    const setter = table === 'productos' ? setProductos : table === 'servicios' ? setServicios : setEventos;
    setter((prev: any[]) => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
    toast.success(item.is_active ? 'Desactivado' : 'Activado');

    const { error } = await supabase.from(table).update({ is_active: !item.is_active }).eq('id', item.id);
    if (error) {
      toast.error('Error: ' + error.message);
      loadData();
    }
  }

  function copyToClipboard(label: string, text: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  }

  const filteredData = {
    pedidos: pedidos.filter(p => p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())),
    citas: citas.filter(c => c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())),
    productos: productos.filter(p => {
      const matchesActive = showInactive || p.is_active;
      const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      return matchesActive && matchesSearch && matchesCategory;
    }),
    servicios: servicios.filter(s => {
      const matchesActive = showInactive || s.is_active;
      const matchesSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || s.category === categoryFilter;
      return matchesActive && matchesSearch && matchesCategory;
    }),
    eventos: eventos.filter(e => (showInactive || e.is_active) && e.title?.toLowerCase().includes(searchTerm.toLowerCase())),
  };

  return (
    <div className="admin-container">
      {!isAuthenticated ? (
        <div className="login-screen">
          <div className="login-card">
            <div className="login-logo">
              <svg viewBox="0 0 580.12 383.73" className="login-logo-svg" aria-hidden="true" focusable="false">
                <path d="M552.34,96C534.17,66.73,509.17,43.25,478,26.19S412.07.5,374.64.5a222.84,222.84,0,0,0-50.37,5.67c33.81,19.08,61.1,45,81,77.09.28.45.54.92.82,1.37a117.55,117.55,0,0,1,27,10.66,111.26,111.26,0,0,1,42,40.17c10.28,17,15.47,36,15.47,56.72a106.46,106.46,0,0,1-15.5,56.28,110.93,110.93,0,0,1-42,40,117.42,117.42,0,0,1-42.89,13.72A130,130,0,0,1,375,303c-21.21,0-40.89-4.93-58.48-14.62a111.23,111.23,0,0,1-42-40A106.51,106.51,0,0,1,259,192.18a107.79,107.79,0,0,1,15.24-56.31,85.31,85.31,0,0,0-23.63-18.94,89.75,89.75,0,0,0-32.18-10.46,101.21,101.21,0,0,0-27.33.22A181.34,181.34,0,0,0,170,192.83a178.08,178.08,0,0,0,27.12,95.54,193.66,193.66,0,0,0,30.1,37.24,205.7,205.7,0,0,0,80.06,47.65,218.56,218.56,0,0,0,66.33,10c37.5,0,72.41-8.6,103.8-25.57s56.55-40.29,74.82-69.32a176.93,176.93,0,0,0,27.41-95.51C579.62,157.75,570.45,125.17,552.34,96Z" fill="var(--primary)"/>
                <path d="M174.65,301.13c-.46-.73-.88-1.48-1.32-2.21A116.71,116.71,0,0,1,147,288.41a110.93,110.93,0,0,1-42-40,106.54,106.54,0,0,1-15.49-56.28A108.13,108.13,0,0,1,105,135.46a110.64,110.64,0,0,1,42-40.13A119.8,119.8,0,0,1,205.48,80.7a126.85,126.85,0,0,1,22.73,2,117.29,117.29,0,0,1,35.42,12.56,111,111,0,0,1,42,40.17c10.28,17,15.47,36,15.47,56.72A106.52,106.52,0,0,1,305.92,248a86,86,0,0,0,23.59,18.8c13.77,7.57,28.65,11.28,45.46,11.28a100.45,100.45,0,0,0,14.26-1,176.43,176.43,0,0,0,20.91-84.23c0-35.08-9.17-67.66-27.28-96.85s-43.17-52.73-74.33-69.79a206.56,206.56,0,0,0-27.06-12.34A217.56,217.56,0,0,0,205.16.5c-37.23,0-71.92,8.64-103,25.69S46,66.73,27.78,96,.5,157.75.5,192.83a178.34,178.34,0,0,0,27.12,95.54c18,29.07,42.87,52.39,73.81,69.32s65.48,25.54,102.72,25.54a226.06,226.06,0,0,0,50.77-5.66C221.46,358.61,194.41,332.94,174.65,301.13Z" fill="var(--primary)"/>
              </svg>
            </div>
            <h1>Admin</h1>
            <p className="login-subtitle">Acceso restringido</p>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                aria-label="Contraseña de administrador"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button onClick={handleLogin} className="btn-primary">Entrar</button>
          </div>
        </div>
      ) : (
        <>
          <header className="admin-header">
            <div className="header-left">
              <Link href="/" className="admin-logo-link">
                <img src="/benso/assets/logos/Isotipo Benso Claro.svg" alt="BENSO" className="admin-logo-img" />
                <span className="admin-logo-label">Admin</span>
              </Link>
            </div>
            <div className="header-right">
              <button onClick={handleLogout} className="btn-outline">Salir</button>
            </div>
          </header>

          <nav className="admin-nav">
            <button onClick={() => setActiveTab('pedidos')} className={`nav-item ${activeTab === 'pedidos' ? 'active' : ''}`}>
              <Package size={18} /> Pedidos <span className="badge">{pedidos.length}</span>
            </button>
            <button onClick={() => setActiveTab('citas')} className={`nav-item ${activeTab === 'citas' ? 'active' : ''}`}>
              <Calendar size={18} /> Citas <span className="badge">{citas.length}</span>
            </button>
            <button onClick={() => setActiveTab('productos')} className={`nav-item ${activeTab === 'productos' ? 'active' : ''}`}>
              <Tag size={18} /> Productos <span className="badge">{productos.length}</span>
            </button>
            <button onClick={() => setActiveTab('servicios')} className={`nav-item ${activeTab === 'servicios' ? 'active' : ''}`}>
              <Wrench size={18} /> Servicios <span className="badge">{servicios.length}</span>
            </button>
            <button onClick={() => setActiveTab('eventos')} className={`nav-item ${activeTab === 'eventos' ? 'active' : ''}`}>
              <CalendarDays size={18} /> Eventos <span className="badge">{eventos.length}</span>
            </button>
          </nav>

          <div className="admin-toolbar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            {(activeTab === 'productos' || activeTab === 'servicios') && (
              <select 
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {(activeTab === 'productos' ? PRODUCT_CATEGORIES : SERVICE_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            )}
            {activeTab !== 'pedidos' && activeTab !== 'citas' && (
              <button onClick={() => { setShowCreateModal(true); setCreateTable(activeTab as 'productos' | 'servicios' | 'eventos'); }} className="btn-add">
                <Plus size={18} /> Añadir
              </button>
            )}
            {activeTab !== 'pedidos' && activeTab !== 'citas' && (
              <label className="filter-toggle">
                <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
                Mostrar inactivos
              </label>
            )}
            <span className="results-count">
              {filteredData[activeTab].length} registros
            </span>
          </div>

          <main className="admin-main">
            {loading ? (
              <div className="loading"><Loader className="spin" size={32} /></div>
            ) : (
              <>
                {activeTab === 'pedidos' && (
                  <div className="table-container">
                    <table className="data-table">
                      <colgroup>
                        <col style={{ width: getColWidth('pedidos-id', colWidths) }} />
                        <col style={{ width: getColWidth('pedidos-cliente', colWidths) }} />
                        <col style={{ width: getColWidth('pedidos-contactos', colWidths) }} />
                        <col style={{ width: getColWidth('pedidos-items', colWidths) }} />
                        <col style={{ width: getColWidth('pedidos-total', colWidths) }} />
                        <col style={{ width: getColWidth('pedidos-estado', colWidths) }} />
                        <col style={{ width: getColWidth('pedidos-fecha', colWidths) }} />
                        <col style={{ width: getColWidth('pedidos-acciones', colWidths) }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={{position:'relative'}}>ID<ColResizeHandle col="pedidos-id" /></th>
                          <th style={{position:'relative'}}>Cliente<ColResizeHandle col="pedidos-cliente" /></th>
                          <th style={{position:'relative'}}>Contactos<ColResizeHandle col="pedidos-contactos" /></th>
                          <th style={{position:'relative'}}>Items<ColResizeHandle col="pedidos-items" /></th>
                          <th style={{position:'relative'}}>Total<ColResizeHandle col="pedidos-total" /></th>
                          <th style={{position:'relative'}}>Estado<ColResizeHandle col="pedidos-estado" /></th>
                          <th style={{position:'relative'}}>Fecha<ColResizeHandle col="pedidos-fecha" /></th>
                          <th style={{position:'relative'}}>Acciones<ColResizeHandle col="pedidos-acciones" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.pedidos.map(p => (
                          <tr key={p.id}>
                            <td className="id-cell">{formatId(p.id)}</td>
                            <td className="name-cell">{p.customer_name}</td>
                            <td>
                              <div className="contact-cell">
                                {p.customer_email && <span><Mail size={14} /> {p.customer_email}</span>}
                              </div>
                            </td>
                            <td className="items-cell">
                              <div className="items-list">
                                {(() => {
                                  const itemsKey = `items-${p.id}`;
                                  const showAll = expandedCells[itemsKey];
                                  const itemsToShow = showAll ? p.items : p.items?.slice(0, 3);
                                  return (itemsToShow || []).map((i: any, idx: number) => (
                                    <span key={idx}>• {i.title} x{i.quantity}</span>
                                  ));
                                })()}
                                {p.items?.length > 3 && (
                                  <button onClick={() => toggleCell(`items-${p.id}`)} className="expand-toggle more">
                                    {expandedCells[`items-${p.id}`] ? 'Ver menos' : `Ver +${p.items.length - 3} más`}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="price-cell">{p.total_price?.toLocaleString()} CUP</td>
                            <td>
                              <select 
                                value={p.status} 
                                onChange={(e) => updateStatus(p.id, e.target.value)}
                                className={`status-select ${p.status}`}
                              >
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="completado">Completado</option>
                              </select>
                            </td>
                            <td className="date-cell">{new Date(p.created_at).toLocaleDateString('es-ES')}</td>
                            <td>
                              <div className="actions-cell">
                                <button onClick={() => copyToClipboard('Pedido', `Pedido #${p.id} - ${p.customer_name}`)} className="btn-icon-sm" title="Copiar info del pedido">
                                  <Copy size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'citas' && (
                  <div className="table-container">
                    <table className="data-table">
                      <colgroup>
                        <col style={{ width: getColWidth('citas-id', colWidths) }} />
                        <col style={{ width: getColWidth('citas-nombre', colWidths) }} />
                        <col style={{ width: getColWidth('citas-contactos', colWidths) }} />
                        <col style={{ width: getColWidth('citas-mensaje', colWidths) }} />
                        <col style={{ width: getColWidth('citas-fecha', colWidths) }} />
                        <col style={{ width: getColWidth('citas-acciones', colWidths) }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={{position:'relative'}}>ID<ColResizeHandle col="citas-id" /></th>
                          <th style={{position:'relative'}}>Nombre<ColResizeHandle col="citas-nombre" /></th>
                          <th style={{position:'relative'}}>Contactos<ColResizeHandle col="citas-contactos" /></th>
                          <th style={{position:'relative'}}>Mensaje<ColResizeHandle col="citas-mensaje" /></th>
                          <th style={{position:'relative'}}>Fecha<ColResizeHandle col="citas-fecha" /></th>
                          <th style={{position:'relative'}}>Acciones<ColResizeHandle col="citas-acciones" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.citas.map(c => (
                          <tr key={c.id}>
                            <td className="id-cell">{formatId(c.id)}</td>
                            <td className="name-cell">{c.nombre}</td>
                            <td>
                              <div className="contact-cell">
                                {c.email && <span><Mail size={14} /> {c.email}</span>}
                                {c.telefono && <span><Phone size={14} /> {c.telefono}</span>}
                              </div>
                            </td>
                            <td className="messaje-cell"><TruncatedCell text={c.mensaje} cellKey={`msg-c-${c.id}`} /></td>
                            <td className="date-cell">{new Date(c.fecha_creacion).toLocaleString('es-ES')}</td>
                            <td>
                              <div className="actions-cell">
                                <button onClick={() => copyToClipboard('Cita', `Cita #${c.id} - ${c.nombre}`)} className="btn-icon-sm" title="Copiar info de la cita">
                                  <Copy size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'productos' && (
                  <div className="table-container">
                    <table className="data-table">
                      <colgroup>
                        <col style={{ width: getColWidth('prod-id', colWidths) }} />
                        <col style={{ width: getColWidth('prod-titulo', colWidths) }} />
                        <col style={{ width: getColWidth('prod-desc', colWidths) }} />
                        <col style={{ width: getColWidth('prod-precio', colWidths) }} />
                        <col style={{ width: getColWidth('prod-popular', colWidths) }} />
                        <col style={{ width: getColWidth('prod-acciones', colWidths) }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={{position:'relative'}}>ID<ColResizeHandle col="prod-id" /></th>
                          <th style={{position:'relative'}}>Producto<ColResizeHandle col="prod-titulo" /></th>
                          <th style={{position:'relative'}}>Descripción<ColResizeHandle col="prod-desc" /></th>
                          <th style={{position:'relative'}}>Precio<ColResizeHandle col="prod-precio" /></th>
                          <th style={{position:'relative'}}>Popular<ColResizeHandle col="prod-popular" /></th>
                          <th style={{position:'relative'}}>Acciones<ColResizeHandle col="prod-acciones" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.productos.map(p => (
                          <tr key={p.id} className={!p.is_active ? 'inactive-row' : ''}>
                            <td className="id-cell">{formatId(p.id)}</td>
                            <td>
                              {editingId === p.id ? (
                                <input 
                                  value={editData.title} 
                                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                                  className="edit-input"
                                />
                              ) : p.title}
                            </td>
                            <td className="desc-cell">
                              {editingId === p.id ? (
                                <textarea 
                                  value={editData.description} 
                                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                                  className="edit-textarea"
                                  rows={2}
                                />
                              ) : (
                                <TruncatedCell text={p.description} cellKey={`desc-p-${p.id}`} />
                              )}
                            </td>
                            <td>
                              {editingId === p.id ? (
                                <input 
                                  value={editData.price} 
                                  onChange={(e) => setEditData({...editData, price: e.target.value})}
                                  className="edit-input price-input"
                                />
                              ) : (
                                <span className="price-display">{p.price}</span>
                              )}
                            </td>
                            <td>
                              {editingId === p.id ? (
                                <input 
                                  type="checkbox" 
                                  checked={editData.popular} 
                                  onChange={(e) => setEditData({...editData, popular: e.target.checked})}
                                  className="edit-checkbox"
                                />
                              ) : (
                                <span className={p.popular ? 'popular-check' : ''}>{p.popular ? '★' : '○'}</span>
                              )}
                            </td>
                            <td>
                              <div className="actions-cell">
                                {editingId === p.id ? (
                                  <>
                                    <button onClick={() => saveEdit('productos')} className="btn-icon-sm success" title="Guardar">
                                      <Save size={14} />
                                    </button>
                                    <button onClick={cancelEdit} className="btn-icon-sm danger" title="Cancelar">
                                      <X size={14} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => startEdit(p, 'productos')} className="btn-icon-sm" title="Editar">
                                      <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => toggleActive('productos', p)} className={`btn-icon-sm ${p.is_active ? 'warning' : 'success'}`} title={p.is_active ? 'Desactivar' : 'Activar'}>
                                      {p.is_active ? <Trash2 size={14} /> : <Check size={14} />}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'servicios' && (
                  <div className="table-container">
                    <table className="data-table">
                      <colgroup>
                        <col style={{ width: getColWidth('serv-id', colWidths) }} />
                        <col style={{ width: getColWidth('serv-titulo', colWidths) }} />
                        <col style={{ width: getColWidth('serv-desc', colWidths) }} />
                        <col style={{ width: getColWidth('serv-precio', colWidths) }} />
                        <col style={{ width: getColWidth('serv-popular', colWidths) }} />
                        <col style={{ width: getColWidth('serv-acciones', colWidths) }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={{position:'relative'}}>ID<ColResizeHandle col="serv-id" /></th>
                          <th style={{position:'relative'}}>Servicio<ColResizeHandle col="serv-titulo" /></th>
                          <th style={{position:'relative'}}>Descripción<ColResizeHandle col="serv-desc" /></th>
                          <th style={{position:'relative'}}>Precio<ColResizeHandle col="serv-precio" /></th>
                          <th style={{position:'relative'}}>Popular<ColResizeHandle col="serv-popular" /></th>
                          <th style={{position:'relative'}}>Acciones<ColResizeHandle col="serv-acciones" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.servicios.map(s => (
                          <tr key={s.id} className={!s.is_active ? 'inactive-row' : ''}>
                            <td className="id-cell">{formatId(s.id)}</td>
                            <td>
                              {editingId === s.id ? (
                                <input 
                                  value={editData.title} 
                                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                                  className="edit-input"
                                />
                              ) : s.title}
                            </td>
                            <td className="desc-cell">
                              {editingId === s.id ? (
                                <textarea 
                                  value={editData.description} 
                                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                                  className="edit-textarea"
                                  rows={2}
                                />
                              ) : (
                                <TruncatedCell text={s.description} cellKey={`desc-s-${s.id}`} />
                              )}
                            </td>
                            <td>
                              {editingId === s.id ? (
                                <input 
                                  value={editData.price} 
                                  onChange={(e) => setEditData({...editData, price: e.target.value})}
                                  className="edit-input price-input"
                                />
                              ) : (
                                <span className="price-display">{s.price}</span>
                              )}
                            </td>
                            <td>
                              {editingId === s.id ? (
                                <input 
                                  type="checkbox" 
                                  checked={editData.popular} 
                                  onChange={(e) => setEditData({...editData, popular: e.target.checked})}
                                  className="edit-checkbox"
                                />
                              ) : (
                                <span className={s.popular ? 'popular-check' : ''}>{s.popular ? '★' : '○'}</span>
                              )}
                            </td>
                            <td>
                              <div className="actions-cell">
                                {editingId === s.id ? (
                                  <>
                                    <button onClick={() => saveEdit('servicios')} className="btn-icon-sm success" title="Guardar">
                                      <Save size={14} />
                                    </button>
                                    <button onClick={cancelEdit} className="btn-icon-sm danger" title="Cancelar">
                                      <X size={14} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => startEdit(s, 'servicios')} className="btn-icon-sm" title="Editar">
                                      <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => toggleActive('servicios', s)} className={`btn-icon-sm ${s.is_active ? 'warning' : 'success'}`} title={s.is_active ? 'Desactivar' : 'Activar'}>
                                      {s.is_active ? <Trash2 size={14} /> : <Check size={14} />}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'eventos' && (
                  <div className="table-container">
                    <table className="data-table">
                      <colgroup>
                        <col style={{ width: getColWidth('ev-id', colWidths) }} />
                        <col style={{ width: getColWidth('ev-titulo', colWidths) }} />
                        <col style={{ width: getColWidth('ev-desc', colWidths) }} />
                        <col style={{ width: getColWidth('ev-fecha', colWidths) }} />
                        <col style={{ width: getColWidth('ev-estado', colWidths) }} />
                        <col style={{ width: getColWidth('ev-acciones', colWidths) }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={{position:'relative'}}>ID<ColResizeHandle col="ev-id" /></th>
                          <th style={{position:'relative'}}>Evento<ColResizeHandle col="ev-titulo" /></th>
                          <th style={{position:'relative'}}>Descripción<ColResizeHandle col="ev-desc" /></th>
                          <th style={{position:'relative'}}>Fecha<ColResizeHandle col="ev-fecha" /></th>
                          <th style={{position:'relative'}}>Estado<ColResizeHandle col="ev-estado" /></th>
                          <th style={{position:'relative'}}>Acciones<ColResizeHandle col="ev-acciones" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.eventos.map(e => (
                          <tr key={e.id} className={!e.is_active ? 'inactive-row' : ''}>
                            <td className="id-cell">{formatId(e.id)}</td>
                            <td>
                              {editingId === e.id ? (
                                <input 
                                  value={editData.title} 
                                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                                  className="edit-input"
                                />
                              ) : e.title}
                            </td>
                            <td className="desc-cell">
                              {editingId === e.id ? (
                                <textarea 
                                  value={editData.description} 
                                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                                  className="edit-textarea"
                                  rows={2}
                                />
                              ) : (
                                <TruncatedCell text={e.description} cellKey={`desc-e-${e.id}`} />
                              )}
                            </td>
                            <td>
                              {editingId === e.id ? (
                                <input 
                                  value={editData.date} 
                                  onChange={(e) => setEditData({...editData, date: e.target.value})}
                                  className="edit-input"
                                />
                              ) : e.date}
                            </td>
                            <td>
                              {editingId === e.id ? (
                                <select 
                                  value={editData.status} 
                                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                                  className="edit-select"
                                >
                                  <option value="En Curso">En Curso</option>
                                  <option value="Proximamente">Próximamente</option>
                                </select>
                              ) : (
                                <span className={`status-badge ${e.status}`}>{e.status}</span>
                              )}
                            </td>
                            <td>
                              <div className="actions-cell">
                                {editingId === e.id ? (
                                  <>
                                    <button onClick={() => saveEdit('eventos')} className="btn-icon-sm success" title="Guardar">
                                      <Save size={14} />
                                    </button>
                                    <button onClick={cancelEdit} className="btn-icon-sm danger" title="Cancelar">
                                      <X size={14} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => startEdit(e, 'eventos')} className="btn-icon-sm" title="Editar">
                                      <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => toggleActive('eventos', e)} className={`btn-icon-sm ${e.is_active ? 'warning' : 'success'}`} title={e.is_active ? 'Desactivar' : 'Activar'}>
                                      {e.is_active ? <Trash2 size={14} /> : <Check size={14} />}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo {createTable === 'productos' ? 'Producto' : createTable === 'servicios' ? 'Servicio' : 'Evento'}</h2>
              <button onClick={() => setShowCreateModal(false)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <label>Título *</label>
              <input value={createData.title} onChange={(e) => setCreateData({...createData, title: e.target.value})} placeholder="Nombre del producto/servicio/evento" />
              
              <label>Descripción</label>
              <textarea value={createData.description} onChange={(e) => setCreateData({...createData, description: e.target.value})} placeholder="Descripción" rows={3} />
              
              <label>Precio *</label>
              <input value={createData.price} onChange={(e) => setCreateData({...createData, price: e.target.value})} placeholder="Ej: $500.00 CUP" />
              
              {createTable !== 'eventos' && (
                <>
                  <label>Categoría</label>
                  <select value={createData.category} onChange={(e) => setCreateData({...createData, category: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {(createTable === 'productos' 
                      ? PRODUCT_CATEGORIES
                      : SERVICE_CATEGORIES
                    ).map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>

                  <label className="checkbox-label">
                    <input type="checkbox" checked={createData.popular} onChange={(e) => setCreateData({...createData, popular: e.target.checked})} />
                    Popular
                  </label>
                </>
              )}
              
              {createTable === 'eventos' && (
                <>
                  <label>Fecha</label>
                  <input value={createData.date || ''} onChange={(e) => setCreateData({...createData, date: e.target.value})} placeholder="Ej: Enero 2025" />
                  <label>Estado</label>
                  <select value={createData.status || 'Proximamente'} onChange={(e) => setCreateData({...createData, status: e.target.value})}>
                    <option value="Proximamente">Próximamente</option>
                    <option value="En Curso">En Curso</option>
                  </select>
                </>
              )}

              <label>WhatsApp Link</label>
              <input value={createData.whatsapp_link} onChange={(e) => setCreateData({...createData, whatsapp_link: e.target.value})} placeholder="https://wa.me/5355609099?text=..." />
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="btn-cancel">Cancelar</button>
              <button onClick={handleCreate} className="btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}