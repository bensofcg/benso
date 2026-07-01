'use client';

import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import {
  Plus, Pencil, ClipboardList, Calendar, AlertTriangle, Users,
} from 'lucide-react';
import type { TeamMember, Task, TaskStatus } from '@/types/team';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// StatusColumn Sub-component
// ─────────────────────────────────────────────

function StatusColumn({
  status,
  tasks,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
  role,
  onEditTask,
}: {
  status: TaskStatus;
  tasks: Task[];
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
// Props Interface
// ─────────────────────────────────────────────

export interface TeamKanbanProps {
  tasks: Task[];
  onTasksChange: React.Dispatch<React.SetStateAction<Task[]>>;
  members: TeamMember[];
  onMembersChange: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  activeMember: TeamMember | null;
  activeMemberId: number | null;
  role: 'admin' | 'user' | null;
  onLoadTasks: (memberId: number) => Promise<void>;
}

// ─────────────────────────────────────────────
// TeamKanban Component
// ─────────────────────────────────────────────

export default function TeamKanban({
  tasks,
  onTasksChange,
  members,
  onMembersChange,
  activeMember,
  activeMemberId,
  role,
  onLoadTasks,
}: TeamKanbanProps) {
  // ── Kanban-specific state ──
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
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const dragCounterRef = useRef<Record<string, number>>({});

  // ── Derived data ──
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };
  // ── Drag & Drop handlers ──
  const handleDrop = useCallback(async (taskId: number, newStatus: TaskStatus) => {
    setDragOverColumn(null);

    // Optimistic update
    onTasksChange(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );

    // Update counts in sidebar optimistically
    onMembersChange(prev =>
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
      if (activeMemberId) onLoadTasks(activeMemberId);
    }
  }, [activeMemberId, tasks, onTasksChange, onMembersChange, onLoadTasks]);

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

  // ── Task CRUD handlers ──
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
    onTasksChange(prev => [...prev, data]);
    // Update counts
    onMembersChange(prev =>
      prev.map(m =>
        m.id === activeMemberId
          ? { ...m, task_counts: { ...m.task_counts, pending: m.task_counts.pending + 1 } }
          : m
      )
    );
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
    onTasksChange(prev =>
      prev.map(t =>
        t.id === editingTask.id
          ? { ...t, title: editTitle.trim(), description: editDesc.trim(), due_date: editDueDate ? new Date(editDueDate).toISOString() : null, payment: editPayment ? parseFloat(editPayment) : 0 }
          : t
      )
    );
  }

  // ── No member selected ──
  if (activeMemberId === null) {
    return (
      <div className="team-loading">
        <Users size={32} opacity={0.3} />
        <span>Selecciona un miembro del equipo</span>
      </div>
    );
  }

  return (
    <>
      {/* New task button */}
      {activeMember && role === 'admin' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            className="btn-add-task"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} /> Nueva tarea
          </button>
        </div>
      )}

      {/* Kanban board */}
      <div className="kanban-board">
        {COLUMNS.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            tasks={groupedTasks[status]}
            onDrop={handleDrop}
            isDragOver={dragOverColumn === status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={(e) => handleDragLeave(e, status)}
            role={role}
            onEditTask={role === 'admin' ? handleEditTask : undefined}
          />
        ))}
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
    </>
  );
}
