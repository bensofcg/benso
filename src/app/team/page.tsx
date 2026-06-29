'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import TeamSidebar, { TeamMember } from './TeamSidebar';
import { useTeamAuth } from '@/context/TeamAuthContext';
import {
  Plus, Loader, X, Users, ClipboardList, Calendar, Clock, AlertTriangle,
} from 'lucide-react';

interface Task {
  id: number;
  member_id: number;
  title: string;
  description: string;
  due_date: string | null;
  payment: number;
  status: 'pending' | 'in_progress' | 'completed';
  position: number;
  created_at: string;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed';

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
}: {
  status: TaskStatus;
  tasks: Task[];
  memberColor: string;
  onDrop: (taskId: number, newStatus: TaskStatus) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
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
            <div className="kanban-card-title">{task.title}</div>
            {task.description && (
              <div className="kanban-card-desc">{task.description}</div>
            )}
            {task.payment > 0 && (
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
// Main Page
// ─────────────────────────────────────────────

export default function TeamPage() {
  const router = useRouter();
  const { role } = useTeamAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  // Fetch members (role-aware)
  useEffect(() => {
    loadMembers();
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

  const activeMember = members.find(m => m.id === activeMemberId) || null;

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/team/login');
  }, [router]);

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

  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const memberColor = activeMember?.color || '#00419d';

  return (
    <div className="team-container">
      <div className="team-layout">
        <TeamSidebar
          members={members}
          activeMemberId={activeMemberId}
          onMemberSelect={setActiveMemberId}
          onAddMember={() => setShowMemberModal(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onRefresh={() => {
            loadMembers();
            if (activeMemberId) loadTasks(activeMemberId);
          }}
          loading={loading}
          isMobile={isMobile}
          onLogout={handleLogout}
          role={role ?? 'admin'}
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
              {activeMember ? (
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
            {activeMember && role === 'admin' && (
              <button
                className="btn-add-task"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={18} /> Nueva tarea
              </button>
            )}
          </div>

          {/* Kanban */}
          <main className="team-main">
            {loading ? (
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
