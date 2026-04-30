'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Package, Calendar, Tag, Wrench, CalendarDays, 
  ChevronRight, ChevronDown, Search, Plus, Check, X,
  Edit2, Save, Trash2, Copy, ExternalLink, RefreshCw,
  Clock, Mail, Phone, MapPin, User, Box, TrendingUp
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

function extractNumberFromPrice(price: string): number {
  const match = price.match(/[\d,.]+/);
  if (match) {
    const numStr = match[0].replace(/,/g, '');
    return parseFloat(numStr) || 0;
  }
  return 0;
}

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'pedidos' | 'citas' | 'productos' | 'servicios' | 'eventos'>('pedidos');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    
    // Auto-calculate price_num from price string
    const priceNum = extractNumberFromPrice(editData.price);
    
    const updateData = {
      ...editData,
      price_num: priceNum
    };
    
    await supabase.from(table).update(updateData).eq('id', editingId);
    setEditingId(null);
    setEditData(null);
    loadData();
  }

  function startEdit(item: any, table: string) {
    setEditingId(item.id);
    setEditData({ ...item });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData(null);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  const filteredData = {
    pedidos: pedidos.filter(p => p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())),
    citas: citas.filter(c => c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())),
    productos: productos.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    servicios: servicios.filter(s => s.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    eventos: eventos.filter(e => e.title?.toLowerCase().includes(searchTerm.toLowerCase())),
  };

  return (
    <div className="admin-container">
      {!isAuthenticated ? (
        <div className="login-screen">
          <div className="login-card">
            <div className="login-icon">
              <Package size={32} />
            </div>
            <h1>BENSO Admin</h1>
            <p>Acceso restringido</p>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={handleLogin} className="btn-primary">Entrar</button>
          </div>
        </div>
      ) : (
        <>
          <header className="admin-header">
            <div className="header-left">
              <span className="logo">BENSO <small>Admin</small></span>
              <span className="version">Panel de Gestión</span>
            </div>
            <div className="header-right">
              <button onClick={loadData} className="btn-icon" title="Actualizar">
                <RefreshCw size={18} />
              </button>
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
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="results-count">
              {filteredData[activeTab].length} registros
            </span>
          </div>

          <main className="admin-main">
            {loading ? (
              <div className="loading"><RefreshCw className="spin" size={32} /></div>
            ) : (
              <>
                {activeTab === 'pedidos' && (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Contactos</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.pedidos.map(p => (
                          <tr key={p.id}>
                            <td className="id-cell">#{p.id}</td>
                            <td className="name-cell">{p.customer_name}</td>
                            <td className="contact-cell">
                              {p.customer_email && <span><Mail size={14} /> {p.customer_email}</span>}
                            </td>
                            <td className="items-cell">
                              <div className="items-list">
                                {p.items?.slice(0, 2).map((i: any, idx: number) => (
                                  <span key={idx}>• {i.title} x{i.quantity}</span>
                                ))}
                                {p.items?.length > 2 && <span className="more">+{p.items.length - 2} más</span>}
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
                            <td className="actions-cell">
                              <button onClick={() => copyToClipboard(String(p.id))} className="btn-icon-sm" title="Copiar ID">
                                <Copy size={14} />
                              </button>
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
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Contactos</th>
                          <th>Mensaje</th>
                          <th>Fecha Solicitud</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.citas.map(c => (
                          <tr key={c.id}>
                            <td className="id-cell">#{c.id}</td>
                            <td className="name-cell">{c.nombre}</td>
                            <td className="contact-cell">
                              {c.email && <span><Mail size={14} /> {c.email}</span>}
                              {c.telefono && <span><Phone size={14} /> {c.telefono}</span>}
                            </td>
                            <td className="messaje-cell">{c.mensaje || '-'}</td>
                            <td className="date-cell">{new Date(c.fecha_creacion).toLocaleString('es-ES')}</td>
                            <td className="actions-cell">
                              <button onClick={() => copyToClipboard(String(c.id))} className="btn-icon-sm" title="Copiar ID">
                                <Copy size={14} />
                              </button>
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
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Producto</th>
                          <th>Descripción</th>
                          <th>Precio</th>
                          <th>Popular</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.productos.map(p => (
                          <tr key={p.id}>
                            <td className="id-cell">#{p.id}</td>
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
                                <span title={p.description}>{p.description?.slice(0, 50)}{p.description?.length > 50 ? '...' : ''}</span>
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
                            <td className="actions-cell">
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
                                <button onClick={() => startEdit(p, 'productos')} className="btn-icon-sm" title="Editar">
                                  <Edit2 size={14} />
                                </button>
                              )}
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
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Servicio</th>
                          <th>Descripción</th>
                          <th>Precio</th>
                          <th>Popular</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.servicios.map(s => (
                          <tr key={s.id}>
                            <td className="id-cell">#{s.id}</td>
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
                                <span title={s.description}>{s.description?.slice(0, 50)}{s.description?.length > 50 ? '...' : ''}</span>
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
                            <td className="actions-cell">
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
                                <button onClick={() => startEdit(s, 'servicios')} className="btn-icon-sm" title="Editar">
                                  <Edit2 size={14} />
                                </button>
                              )}
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
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Evento</th>
                          <th>Descripción</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.eventos.map(e => (
                          <tr key={e.id}>
                            <td className="id-cell">#{e.id}</td>
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
                                <span title={e.description}>{e.description?.slice(0, 50)}{e.description?.length > 50 ? '...' : ''}</span>
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
                            <td className="actions-cell">
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
                                <button onClick={() => startEdit(e, 'eventos')} className="btn-icon-sm" title="Editar">
                                  <Edit2 size={14} />
                                </button>
                              )}
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

      <style jsx>{`
        .admin-container { min-height: 100vh; background: #f8f9fa; }
        .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #002c6a 0%, #00419d 100%); }
        .login-card { background: white; padding: 3rem; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; width: 100%; max-width: 400px; }
        .login-icon { width: 64px; height: 64px; margin: 0 auto 1.5rem; background: #002c6a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
        .login-card h1 { color: #002c6a; margin: 0 0 0.5rem; }
        .login-card p { color: #666; margin: 0 0 2rem; }
        .login-card input { width: 100%; padding: 1rem; border: 2px solid #e6e6e6; border-radius: 8px; margin-bottom: 1rem; }
        .login-card input:focus { outline: none; border-color: #002c6a; }
        .btn-primary { width: 100%; padding: 1rem; background: #002c6a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        
        .admin-header { background: #002c6a; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .header-left { display: flex; align-items: baseline; gap: 1rem; }
        .logo { font-size: 1.5rem; font-weight: 700; }
        .logo small { background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem; }
        .version { font-size: 0.85rem; opacity: 0.7; }
        .header-right { display: flex; gap: 0.75rem; align-items: center; }
        .btn-icon { background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem; border-radius: 6px; cursor: pointer; }
        .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.5); color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
        
        .admin-nav { background: white; padding: 0 2rem; display: flex; gap: 0.25rem; border-bottom: 1px solid #e6e6e6; }
        .nav-item { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.25rem; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; color: #666; font-weight: 500; }
        .nav-item.active { border-bottom-color: #002c6a; color: #002c6a; }
        .nav-item .badge { background: #e6e6e6; padding: 0.15rem 0.5rem; border-radius: 10px; font-size: 0.75rem; }
        .nav-item.active .badge { background: #002c6a; color: white; }
        
        .admin-toolbar { padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; background: white; border-bottom: 1px solid #e6e6e6; }
        .search-box { display: flex; align-items: center; gap: 0.5rem; background: #f8f8f8; padding: 0.5rem 1rem; border-radius: 8px; width: 300px; }
        .search-box input { border: none; background: none; outline: none; flex: 1; }
        .results-count { color: #666; font-size: 0.9rem; }
        
        .admin-main { padding: 1.5rem 2rem; }
        .loading { text-align: center; padding: 3rem; color: #002c6a; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .table-container { background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #f8f8f8; padding: 1rem; text-align: left; font-weight: 600; color: #666; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e6e6e6; }
        .data-table td { padding: 1rem; border-bottom: 1px solid #f0f0f0; }
        .data-table tr:hover { background: #fafafa; }
        
        .id-cell { font-weight: 700; color: #002c6a; }
        .name-cell { font-weight: 600; }
        .contact-cell { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; color: #666; }
        .contact-cell span { display: flex; align-items: center; gap: 0.4rem; }
        .items-cell { max-width: 200px; }
        .items-list { font-size: 0.85rem; color: #666; display: flex; flex-direction: column; }
        .items-list .more { color: #002c6a; font-weight: 500; }
        .price-cell { font-weight: 700; color: #002c6a; }
        .date-cell { font-size: 0.85rem; color: #888; }
        .messaje-cell { max-width: 250px; font-size: 0.85rem; color: #666; }
        .desc-cell { max-width: 200px; font-size: 0.85rem; color: #666; overflow: hidden; text-overflow: ellipsis; }
        
        .status-select { padding: 0.4rem 0.75rem; border-radius: 20px; border: none; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .status-select.pendiente { background: #fff3e0; color: #e65100; }
        .status-select.confirmado { background: #e3f2fd; color: #1565c0; }
        .status-select.completado { background: #e8f5e9; color: #2e7d32; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .status-badge.En Curso { background: #e3f2fd; color: #1565c0; }
        .status-badge.Proximamente { background: #f3e5f5; color: #7b1fa2; }
        
        .actions-cell { display: flex; gap: 0.5rem; }
        .btn-icon-sm { background: #f0f0f0; border: none; padding: 0.4rem; border-radius: 6px; cursor: pointer; color: #666; }
        .btn-icon-sm:hover { background: #e6e6e6; }
        .btn-icon-sm.success { background: #e8f5e9; color: #2e7d32; }
        .btn-icon-sm.danger { background: #ffebee; color: #c62828; }
        
        .edit-input { width: 100%; padding: 0.5rem; border: 2px solid #002c6a; border-radius: 6px; }
        .edit-textarea { width: 100%; padding: 0.5rem; border: 2px solid #002c6a; border-radius: 6px; resize: vertical; font-family: inherit; font-size: 0.85rem; }
        .edit-select { padding: 0.4rem 0.75rem; border: 2px solid #002c6a; border-radius: 6px; font-size: 0.85rem; background: white; }
        .edit-checkbox { width: 20px; height: 20px; cursor: pointer; }
        
        .price-input { min-width: 120px; }
        .price-display { font-weight: 600; color: #002c6a; }
        
        .price-type-badge { 
          padding: 0.2rem 0.5rem; 
          border-radius: 4px; 
          font-size: 0.75rem; 
          font-weight: 600;
          background: #e8f5e9; 
          color: #2e7d32;
        }
        .price-type-badge.desde { 
          background: #fff3e0; 
          color: #e65100; 
        }
        
        .popular-check { color: #ffb300; font-size: 1.1rem; }
        
        @media (max-width: 1024px) {
          .data-table { font-size: 0.85rem; }
          .data-table th, .data-table td { padding: 0.75rem 0.5rem; }
          .edit-input, .edit-select { font-size: 0.8rem; padding: 0.4rem; }
        }
      `}</style>
    </div>
  );
}