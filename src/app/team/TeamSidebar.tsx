'use client';

import { motion } from 'motion/react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  LogOut,
  Plus,
} from 'lucide-react';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  color: string;
  task_counts: {
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export interface TeamSidebarProps {
  members: TeamMember[];
  activeMemberId: number | null;
  onMemberSelect: (id: number) => void;
  onAddMember: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRefresh: () => void;
  loading: boolean;
  isMobile: boolean;
  onLogout?: () => void;
  role: 'admin' | 'user';
}

export default function TeamSidebar({
  members,
  activeMemberId,
  onMemberSelect,
  onAddMember,
  isCollapsed,
  onToggleCollapse,
  onRefresh,
  loading,
  isMobile,
  onLogout,
  role,
}: TeamSidebarProps) {
  return (
    <>
      {isMobile && !isCollapsed && (
        <div className="sidebar-backdrop" onClick={onToggleCollapse} />
      )}
      <motion.aside
        className="app-sidebar team-sidebar"
        animate={{ width: isCollapsed ? 64 : 220 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-inner">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <img
                src="/benso/assets/logos/Isotipo Benso Claro.svg"
                alt="BENSO"
                className="sidebar-logo-img"
              />
              {!isCollapsed && <span className="sidebar-logo-label">Team</span>}
            </div>
            <button
              className="sidebar-toggle"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expandir' : 'Colapsar'}
              aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          {/* Team Members */}
          <nav className="sidebar-nav team-sidebar-nav">
            {role === 'admin' && !isCollapsed && (
              <div className="sidebar-section-title-row">
                <span className="sidebar-section-title">MIEMBROS</span>
                <button
                  className="sidebar-add-btn"
                  onClick={onAddMember}
                  title="Añadir miembro"
                  aria-label="Añadir miembro"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
            {members.map((member) => {
              const total = member.task_counts.pending + member.task_counts.in_progress + member.task_counts.completed;
              return (
                <button
                  key={member.id}
                  className={`sidebar-item team-member-item${activeMemberId === member.id ? ' active' : ''}`}
                  onClick={() => onMemberSelect(member.id)}
                  title={isCollapsed ? member.name : undefined}
                  style={{
                    borderLeft: activeMemberId === member.id ? `3px solid ${member.color}` : '3px solid transparent',
                  }}
                >
                  <span
                    className="team-member-avatar"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                  {!isCollapsed && (
                    <div className="team-member-info">
                      <span className="team-member-name">{member.name}</span>
                      <span className="team-member-role">{member.role}</span>
                    </div>
                  )}
                  {!isCollapsed && (
                    <span className="badge team-member-badge">{total}</span>
                  )}
                </button>
              );
            })}
            {role === 'admin' && isCollapsed && (
              <button
                className="sidebar-item sidebar-add-btn-collapsed"
                onClick={onAddMember}
                title="Añadir miembro"
                aria-label="Añadir miembro"
              >
                <span className="sidebar-item-icon">
                  <Plus size={18} />
                </span>
              </button>
            )}
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <button
              className="sidebar-item sidebar-footer-btn"
              onClick={onRefresh}
              title={isCollapsed ? 'Actualizar' : ''}
            >
              <span className="sidebar-item-icon">
                <RefreshCw size={18} className={loading ? 'spin' : ''} />
              </span>
              {!isCollapsed && (
                <span className="sidebar-item-label">{loading ? 'Cargando...' : 'Actualizar'}</span>
              )}
            </button>
            {onLogout && (
              <button
                className="sidebar-item sidebar-footer-btn"
                onClick={onLogout}
                title={isCollapsed ? 'Salir' : ''}
              >
                <span className="sidebar-item-icon">
                  <LogOut size={18} />
                </span>
                {!isCollapsed && (
                  <span className="sidebar-item-label">Salir</span>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
