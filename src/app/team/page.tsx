'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import TeamSidebar from './TeamSidebar';
import { useTeamAuth } from '@/context/TeamAuthContext';
import type { TeamMember, Task, TaskStatus, MonthlyReportRow, MonthlyReportTask } from '@/types/team';

const REPORT_MONTHS = [
  { key: '2026-05', label: 'Mayo 2026', startDate: '2026-05-01T00:00:00Z', endDate: '2026-06-01T00:00:00Z', isFake: true },
  { key: '2026-06', label: 'Junio 2026', startDate: '2026-06-01T00:00:00Z', endDate: '2026-07-01T00:00:00Z', isFake: false },
];
import {
  Plus, Loader, X, Users, ClipboardList, Calendar, Clock, AlertTriangle, Pencil, BarChart3,
} from 'lucide-react';

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendientes',
  in_progress: 'En Progreso',
  completed: 'Completadas',
};

const COLUMNS: TaskStatus[] = ['pending', 'in_progress', 'completed'];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatRemainingTime(dueDate: string): { text: string; urgent: boolean; overdue: boolean } {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const totalHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (diffMs < 0) {
    if (days > 0) return { text: `Atrasada ${days}d`, urgent: false, overdue: true };
    if (hours > 0) return { text: `Atrasada ${hours}h`, urgent: false, overdue: true };
    return { text: 'Vencida', urgent: false, overdue: true };
  }

  if (days === 0 && hours === 0) return { text: 'Hoy', urgent: true, overdue: false };
  if (days === 0) return { text: `En ${hours}h`, urgent: hours <= 4, overdue: false };
  if (days === 1) return { text: 'Mañana', urgent: true, overdue: false };
  if (days < 7) return { text: `${days}d restantes`, urgent: false, overdue: false };
  return { text: due.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }), urgent: false, overdue: false };
}

function formatDateInput(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 16);
}

// ─────────────────────────────────────────────
// Drag & Drop Helpers (native HTML5 DnD API)
// ─────────────────────────────────────────────

let draggedTaskId: number | null = null;

function StatusColumn({
  status,
  tasks,
  memberColor,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
  role,
  onEditTask,
}: {
  status: TaskStatus;
  tasks: Task[];
  memberColor: string;
  onDrop: (taskId: number, newStatus: TaskStatus) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  role: 'admin' | 'user' | null;
  onEditTask?: (task: Task) => void;
}) {
  return (
    <div
      className={`kanban-column ${status} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        if (draggedTaskId !== null) {
          onDrop(draggedTaskId, status);
          draggedTaskId = null;
        }
      }}
    >
      <div className="kanban-column-header">
        <div className="kanban-column-title">
          <span className="kanban-column-dot" />
          {STATUS_LABELS[status]}
        </div>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>
      <div className="kanban-cards">
        {tasks.length === 0 && (
          <div className="kanban-empty-state">
            <ClipboardList size={24} opacity={0.3} />
            <span>Sin tareas</span>
          </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="kanban-card"
            draggable
            onDragStart={(e) => {
              draggedTaskId = task.id;
              e.currentTarget.classList.add('dragging');
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnd={(e) => {
              e.currentTarget.classList.remove('dragging');
            }}
          >
            <div className="kanban-card-title-row">
              <div className="kanban-card-title">{task.title}</div>
              {role === 'admin' && onEditTask && (
                <button
                  className="kanban-card-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  title="Editar tarea"
                  aria-label="Editar tarea"
                >
                  <Pencil size={12} />
                </button>
              )}
            </div>
            {task.description && (
              <div className="kanban-card-desc">{task.description}</div>
            )}
            {role === 'admin' && task.payment > 0 && (
              <div className="kanban-card-payment">${Number(task.payment).toLocaleString('es-CU')}</div>
            )}
            {task.due_date && (() => {
              const remaining = formatRemainingTime(task.due_date);
              return (
                <div className={`kanban-card-due ${remaining.urgent ? 'urgent' : ''} ${remaining.overdue ? 'overdue' : ''}`}>
                  {remaining.overdue ? <AlertTriangle size={12} /> : <Calendar size={12} />}
                  <span>{remaining.text}</span>
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Report Row (expandable)
// ─────────────────────────────────────────────

function ReportRow({ row }: { row: MonthlyReportRow }) {
  const [open, setOpen] = useState(false);
  const subtaskTotal = row.tasks.reduce((s, t) => s + t.payment, 0);

  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
        className={open ? 'report-row-expanded' : ''}
      >
        <td>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: row.color, flexShrink: 0, display: 'inline-block',
              }}
            />
            {row.name}
            <span
              style={{
                marginLeft: '0.25rem',
                fontSize: '0.65rem',
                color: '#aaa',
                transition: 'transform 0.2s',
                display: 'inline-block',
                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            >
              ▶
            </span>
          </span>
        </td>
        <td style={{ textAlign: 'center', color: '#666' }}>{row.completed_count}</td>
        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
          ${Number(row.total_payment).toLocaleString('es-CU')}
        </td>
      </tr>
      {open && (
        <>
          {row.tasks.map((task) => (
            <tr key={task.id} className="report-subtask-row">
              <td style={{ paddingLeft: '2.5rem', color: '#666', fontSize: '0.82rem' }}>
                {task.title}
              </td>
              <td />
              <td style={{ textAlign: 'right', color: '#888', fontSize: '0.82rem' }}>
                {task.payment > 0 ? `$${task.payment.toLocaleString('es-CU')}` : '—'}
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function TeamPage() {
  const router = useRouter();
  const { session, loading: authLoading, profile, role, signOut } = useTeamAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportRow[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('2026-06');
  const [view, setView] = useState<'kanban' | 'reports'>('kanban');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPayment, setEditPayment] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPayment, setNewTaskPayment] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberColor, setNewMemberColor] = useState('#0056d0');
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const dragCounterRef = useRef<Record<string, number>>({});

  // Detect mobile
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) setIsCollapsed(true);
    };
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Fetch members (role-aware), then load report
  useEffect(() => {
    loadMembers().then(() => loadMonthlyReport(selectedMonth));
  }, [role]);

  // Fetch tasks when active member changes
  useEffect(() => {
    if (activeMemberId !== null) {
      loadTasks(activeMemberId);
    }
  }, [activeMemberId]);

  async function loadMembers() {
    setLoading(true);
    try {
      let query = supabase.from('team_members').select('*');

      if (role === 'user') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('profile_id', user.id);
        }
      }

      query = query.order('id');
      const { data: membersData, error } = await query;

      if (error) throw error;

      // Get task counts per member
      const { data: tasksData } = await supabase
        .from('team_tasks')
        .select('member_id, status');

      const countsMap: Record<number, { pending: number; in_progress: number; completed: number }> = {};
      (tasksData || []).forEach((t: any) => {
        if (!countsMap[t.member_id]) {
          countsMap[t.member_id] = { pending: 0, in_progress: 0, completed: 0 };
        }
        if (t.status in countsMap[t.member_id]) {
          (countsMap[t.member_id] as any)[t.status]++;
        }
      });

      const enriched: TeamMember[] = (membersData || []).map((m: any) => ({
        ...m,
        task_counts: countsMap[m.id] || { pending: 0, in_progress: 0, completed: 0 },
      }));

      setMembers(enriched);

      // Auto-select first member if none selected
      if (enriched.length > 0 && activeMemberId === null) {
        setActiveMemberId(enriched[0].id);
      }
    } catch (e) {
      console.error('Error loading members:', e);
      toast.error('Error al cargar miembros');
    }
    setLoading(false);
  }

  async function loadTasks(memberId: number) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_tasks')
        .select('*')
        .eq('member_id', memberId)
        .order('position', { ascending: true })
        .order('id', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (e) {
      console.error('Error loading tasks:', e);
      toast.error('Error al cargar tareas');
    }
    setLoading(false);
  }

  const FAKE_TASKS: Record<string, { title: string; payment: number }[]> = {
    'Pablo García': [
      { title: 'Rediseñar landing page', payment: 250 },
      { title: 'Optimizar imágenes del sitio', payment: 120 },
      { title: 'Corregir bug en formulario de contacto', payment: 0 },
      { title: 'Implementar modo oscuro', payment: 180 },
    ],
    'Laura Díaz': [
      { title: 'Crear mockups de la app móvil', payment: 300 },
      { title: 'Auditar accesibilidad', payment: 0 },
      { title: 'Sistema de diseño', payment: 400 },
    ],
    'Carlos Mendoza': [
      { title: 'Planificar sprint 5', payment: 0 },
      { title: 'Reunión con stakeholders', payment: 0 },
      { title: 'Revisar presupuesto Q3', payment: 150 },
    ],
    'Ana Martínez': [
      { title: 'Campaña redes sociales', payment: 200 },
      { title: 'SEO del blog', payment: 80 },
      { title: 'Newsletter semanal', payment: 60 },
      { title: 'Analítica de tráfico', payment: 0 },
    ],
    'José Rodríguez': [
      { title: 'Tests de integración', payment: 160 },
      { title: 'Automatizar E2E', payment: 220 },
      { title: 'Reporte de bugs', payment: 0 },
    ],
  };

  async function loadMonthlyReport(monthKey?: string) {
    const monthCfg = REPORT_MONTHS.find(m => m.key === (monthKey || selectedMonth)) || REPORT_MONTHS[0];
    let report: MonthlyReportRow[] = [];

    if (monthCfg.isFake) {
      // Datos ficticios archivados
      const { data: membersData } = await supabase.from('team_members').select('id, name, color');
      const members = membersData || [];
      for (const member of members) {
        const tasks = FAKE_TASKS[member.name];
        if (tasks) {
          const totalPayment = tasks.reduce((s, t) => s + t.payment, 0);
          report.push({
            member_id: member.id,
            name: member.name,
            color: member.color || '#00419d',
            completed_count: tasks.length,
            total_payment: totalPayment,
            tasks: tasks.map((t, i) => ({ id: -(member.id * 100 + i), title: t.title, payment: t.payment })),
          });
        }
      }
    } else {
      // Datos reales desde la BD
      const [tasksResult, membersResult] = await Promise.all([
        supabase
          .from('team_tasks')
          .select('id, member_id, title, payment')
          .eq('status', 'completed')
          .gte('updated_at', monthCfg.startDate)
          .lt('updated_at', monthCfg.endDate),
        supabase.from('team_members').select('id, name, color'),
      ]);

      if (!tasksResult.error && !membersResult.error) {
        const grouped = new Map<number, MonthlyReportTask[]>();
        for (const row of tasksResult.data || []) {
          const list = grouped.get(row.member_id) || [];
          list.push({ id: row.id, title: row.title, payment: Number(row.payment) || 0 });
          grouped.set(row.member_id, list);
        }

        for (const member of membersResult.data || []) {
          const tasks = grouped.get(member.id);
          if (tasks && tasks.length > 0) {
            const totalPayment = tasks.reduce((s, t) => s + t.payment, 0);
            report.push({
              member_id: member.id,
              name: member.name,
              color: member.color || '#00419d',
              completed_count: tasks.length,
              total_payment: totalPayment,
              tasks,
            });
          }
        }
      }
    }

    setMonthlyReport(report);
  }

  const activeMember = members.find(m => m.id === activeMemberId) || null;

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch {
      // falló signOut, forzamos redirect igual
    }
    // Forzar navegación incluso si signOut falla o el evento tarde
    router.push('/team/login');
  }, [signOut, router]);

  // Handle drop — update task status
  const handleDrop = useCallback(async (taskId: number, newStatus: TaskStatus) => {
    setDragOverColumn(null);

    // Optimistic update
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );

    // Update counts in sidebar optimistically
    setMembers(prev =>
      prev.map(m => {
        if (m.id !== activeMemberId) return m;
        const oldTask = tasks.find(t => t.id === taskId);
        if (!oldTask) return m;
        const newCounts = { ...m.task_counts };
        newCounts[oldTask.status] = Math.max(0, newCounts[oldTask.status] - 1);
        (newCounts as any)[newStatus]++;
        return { ...m, task_counts: newCounts };
      })
    );

    toast.success(`Movida a ${STATUS_LABELS[newStatus]}`);

    // Background sync
    const { error } = await supabase
      .from('team_tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) {
      toast.error('Error al actualizar: ' + error.message);
      if (activeMemberId) loadTasks(activeMemberId);
    }
  }, [activeMemberId, tasks]);

  // Drag over handlers per column
  const handleDragOver = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragCounterRef.current[status]) {
      dragCounterRef.current[status] = 0;
    }
    dragCounterRef.current[status]++;
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, status: TaskStatus) => {
    dragCounterRef.current[status] = (dragCounterRef.current[status] || 1) - 1;
    if (dragCounterRef.current[status] <= 0) {
      dragCounterRef.current[status] = 0;
      setDragOverColumn(prev => prev === status ? null : prev);
    }
  }, []);

  // Create new task
  async function handleCreateTask() {
    if (!newTaskTitle.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    if (!activeMemberId) {
      toast.error('Selecciona un miembro primero');
      return;
    }

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const newPosition = pendingTasks.length;

    const { data, error } = await supabase
      .from('team_tasks')
      .insert({
        member_id: activeMemberId,
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim(),
        due_date: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
        payment: newTaskPayment ? parseFloat(newTaskPayment) : 0,
        status: 'pending',
        position: newPosition,
      })
      .select()
      .single();

    if (error) {
      toast.error('Error: ' + error.message);
      return;
    }

    toast.success('Tarea creada');
    setShowCreateModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDueDate('');
    setNewTaskPayment('');

    // Add to local state
    setTasks(prev => [...prev, data]);
    // Update counts
    setMembers(prev =>
      prev.map(m =>
        m.id === activeMemberId
          ? { ...m, task_counts: { ...m.task_counts, pending: m.task_counts.pending + 1 } }
          : m
      )
    );
  }

  async function handleCreateMember() {
    if (!newMemberName.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    const { data, error } = await supabase
      .from('team_members')
      .insert({
        name: newMemberName.trim(),
        role: newMemberRole.trim(),
        color: newMemberColor,
      })
      .select()
      .single();

    if (error) {
      toast.error('Error: ' + error.message);
      return;
    }

    toast.success(`${newMemberName.trim()} añadido al equipo`);
    setShowMemberModal(false);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberColor('#0056d0');

    // Add to local state
    setMembers(prev => [...prev, { ...data, task_counts: { pending: 0, in_progress: 0, completed: 0 } }]);
    setActiveMemberId(data.id);
  }

  const handleEditTask = useCallback((task: Task) => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditDueDate(task.due_date ? formatDateInput(task.due_date) : '');
    setEditPayment(task.payment > 0 ? String(task.payment) : '');
    setEditingTask(task);
  }, []);

  async function handleUpdateTask() {
    if (!editingTask) return;
    if (!editTitle.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    const { error } = await supabase
      .from('team_tasks')
      .update({
        title: editTitle.trim(),
        description: editDesc.trim(),
        due_date: editDueDate ? new Date(editDueDate).toISOString() : null,
        payment: editPayment ? parseFloat(editPayment) : 0,
      })
      .eq('id', editingTask.id);

    if (error) {
      toast.error('Error: ' + error.message);
      return;
    }

    toast.success('Tarea actualizada');
    setEditingTask(null);

    // Update local state
    setTasks(prev =>
      prev.map(t =>
        t.id === editingTask.id
          ? { ...t, title: editTitle.trim(), description: editDesc.trim(), due_date: editDueDate ? new Date(editDueDate).toISOString() : null, payment: editPayment ? parseFloat(editPayment) : 0 }
          : t
      )
    );
  }

  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const memberColor = activeMember?.color || '#00419d';

  // ── Auth guard ────────────────────────────
  const authGuardPassed = useRef(false);
  useEffect(() => {
    if (authLoading) return;
    if (!session || !profile) {
      if (!authGuardPassed.current) {
        authGuardPassed.current = true;
        router.push('/team/login');
      }
    }
  }, [session, profile, authLoading, router]);

  if (authLoading) {
    return (
      <div className="team-loading" style={{ minHeight: '100vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader size={24} />
        </motion.div>
        <span>Cargando sesión…</span>
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  // ── Kanban content ────────────────────────
  return (
    <div className="team-container">
      <div className="team-layout">
        <TeamSidebar
          members={members}
          activeMemberId={activeMemberId}
          onMemberSelect={(id) => { setView('kanban'); setActiveMemberId(id); }}
          onAddMember={() => setShowMemberModal(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onRefresh={() => {
            loadMembers().then(() => loadMonthlyReport(selectedMonth));
            if (activeMemberId) loadTasks(activeMemberId);
          }}
          loading={loading}
          isMobile={isMobile}
          onLogout={handleLogout}
          role={role ?? 'admin'}
          onViewReports={() => setView('reports')}
          activeView={view}
        />

        <motion.div
          className="team-content-wrapper"
          animate={{ marginLeft: isMobile ? 64 : (isCollapsed ? 64 : 220) }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Mobile member selector (admin only) */}
          {role === 'admin' && (
            <div className="team-member-select-mobile">
              <select
                value={activeMemberId ?? ''}
                onChange={(e) => setActiveMemberId(Number(e.target.value))}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Header */}
          <div className="team-header">
            <h1>
              {view === 'reports' ? (
                <>
                  <BarChart3 size={22} />
                  Reportes
                </>
              ) : activeMember ? (
                <>
                  <span
                    className="team-member-header-dot"
                    style={{ backgroundColor: memberColor }}
                  />
                  {activeMember.name}
                  <span className="team-header-role">{activeMember.role}</span>
                </>
              ) : (
                <>
                  <Users size={24} />
                  Equipo
                </>
              )}
            </h1>
            {view === 'kanban' && activeMember && role === 'admin' && (
              <button
                className="btn-add-task"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={18} /> Nueva tarea
              </button>
            )}
          </div>

          {/* Content: Kanban or Reports */}
          <main className="team-main">
            {view === 'reports' ? (
              <div className="report-page">

                {/* Month tabs */}
                <div className="report-tabs">
                  {REPORT_MONTHS.map((m) => {
                    const isArchived = m.isFake;
                    return (
                      <button
                        key={m.key}
                        className={`report-tab${selectedMonth === m.key ? ' active' : ''}`}
                        onClick={() => {
                          setSelectedMonth(m.key);
                          loadMonthlyReport(m.key);
                        }}
                      >
                        {m.label}
                        {isArchived && <span className="report-tab-badge">Archivado</span>}
                      </button>
                    );
                  })}
                </div>

                {monthlyReport.length === 0 ? (
                  <div className="team-loading" style={{ padding: '2rem 0' }}>
                    <BarChart3 size={32} opacity={0.3} />
                    <span>Sin datos este mes</span>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: 'auto' }}>Miembro</th>
                          <th style={{ width: '100px', textAlign: 'center' }}>Tareas</th>
                          <th style={{ width: '120px', textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyReport.map((row) => (
                          <ReportRow key={row.member_id} row={row} />
                        ))}
                        <tr style={{ background: '#f8f9fa', fontWeight: 700 }}>
                          <td>Total general</td>
                          <td style={{ textAlign: 'center' }}>
                            {monthlyReport.reduce((s, r) => s + r.completed_count, 0)}
                          </td>
                          <td style={{ textAlign: 'right', color: 'var(--primary)' }}>
                            ${monthlyReport.reduce((s, r) => s + r.total_payment, 0).toLocaleString('es-CU')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : loading ? (
              <div className="team-loading">
                <Loader className="spin" size={28} />
                Cargando...
              </div>
            ) : activeMemberId === null ? (
              <div className="team-loading">
                <Users size={32} opacity={0.3} />
                <span>Selecciona un miembro del equipo</span>
              </div>
            ) : (
              <div className="kanban-board">
                {COLUMNS.map((status) => (
                  <StatusColumn
                    key={status}
                    status={status}
                    tasks={groupedTasks[status]}
                    memberColor={memberColor}
                    onDrop={handleDrop}
                    isDragOver={dragOverColumn === status}
                    onDragOver={(e) => handleDragOver(e, status)}
                    onDragLeave={(e) => handleDragLeave(e, status)}
                    role={role}
                    onEditTask={role === 'admin' ? handleEditTask : undefined}
                  />
                ))}
              </div>
            )}
          </main>
        </motion.div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Tarea</h2>
              <button onClick={() => setShowCreateModal(false)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <label>Título *</label>
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="¿Qué hay que hacer?"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
              />

              <label>Descripción</label>
              <textarea
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Detalles de la tarea (opcional)"
                rows={3}
              />

              <label>Fecha límite</label>
              <input
                type="datetime-local"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />

              <label>Monto al completar</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newTaskPayment}
                onChange={(e) => setNewTaskPayment(e.target.value)}
                placeholder="Ej: 500.00"
              />
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="btn-cancel">Cancelar</button>
              <button onClick={handleCreateTask} className="btn-primary">Crear tarea</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Tarea</h2>
              <button onClick={() => setEditingTask(null)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <label>Título *</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="¿Qué hay que hacer?"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateTask()}
              />

              <label>Descripción</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Detalles de la tarea (opcional)"
                rows={3}
              />

              <label>Fecha límite</label>
              <input
                type="datetime-local"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />

              <label>Monto al completar</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editPayment}
                onChange={(e) => setEditPayment(e.target.value)}
                placeholder="Ej: 500.00"
              />
            </div>
            <div className="modal-footer">
              <button onClick={() => setEditingTask(null)} className="btn-cancel">Cancelar</button>
              <button onClick={handleUpdateTask} className="btn-primary">Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Miembro</h2>
              <button onClick={() => setShowMemberModal(false)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <label>Nombre *</label>
              <input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Nombre del miembro"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateMember()}
              />

              <label>Rol</label>
              <input
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                placeholder="Ej: Diseñador UX"
              />

              <label>Color</label>
              <div className="color-picker-row">
                {['#0056d0', '#e91e63', '#2e7d32', '#e65100', '#6a1b9a', '#00838f', '#f9a825', '#d32f2f'].map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch${newMemberColor === c ? ' active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setNewMemberColor(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowMemberModal(false)} className="btn-cancel">Cancelar</button>
              <button onClick={handleCreateMember} className="btn-primary">Añadir miembro</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
