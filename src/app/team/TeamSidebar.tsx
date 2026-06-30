'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  LogOut,
  Plus,
  ChevronDown,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import type { TeamMember } from '@/types/team';

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
  onViewReports: () => void;
  activeView: 'kanban' | 'reports';
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
  onViewReports,
  activeView,
}: TeamSidebarProps) {
  const [membersOpen, setMembersOpen] = useState(true);

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

          {/* Navigation */}
          <nav className="sidebar-nav team-sidebar-nav">
            {role === 'admin' ? (
              <>
                {/* ── MIEMBROS ── */}
                {!isCollapsed && (
                  <div className="sidebar-section">
                    <button
                      className="sidebar-section-toggle"
                      onClick={() => setMembersOpen(!membersOpen)}
                    >
                      {membersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="sidebar-section-title">MIEMBROS</span>
                      <button
                        className="sidebar-add-btn"
                        onClick={(e) => { e.stopPropagation(); onAddMember(); }}
                        title="Añadir miembro"
                        aria-label="Añadir miembro"
                      >
                        <Plus size={14} />
                      </button>
                    </button>
                    <div className={`sidebar-collapse-content${membersOpen ? ' open' : ''}`}>
                      {members.map((member) => {
                        const total = member.task_counts.pending + member.task_counts.in_progress + member.task_counts.completed;
                        return (
                          <button
                            key={member.id}
                            className={`sidebar-item team-member-item${activeMemberId === member.id && activeView === 'kanban' ? ' active' : ''}`}
                            onClick={() => onMemberSelect(member.id)}
                            title={member.name}
                          >
                            <span
                              className="team-member-dot"
                              style={{ backgroundColor: member.color }}
                            />
                            <div className="team-member-info">
                              <span className="team-member-name">{member.name}</span>
                            </div>
                            <span className="badge team-member-badge">{total}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Collapsed member add button */}
                {isCollapsed && (
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

                {/* ── REPORTES ── */}
                {!isCollapsed && (
                  <div className="sidebar-section" style={{ marginTop: '0.5rem' }}>
                    <button
                      className={`sidebar-item sidebar-reports-btn${activeView === 'reports' ? ' active' : ''}`}
                      onClick={onViewReports}
                    >
                      <span className="sidebar-item-icon">
                        <BarChart3 size={16} />
                      </span>
                      <span className="sidebar-item-label">Reportes</span>
                    </button>
                  </div>
                )}

                {isCollapsed && (
                  <button
                    className={`sidebar-item sidebar-reports-btn${activeView === 'reports' ? ' active' : ''}`}
                    onClick={onViewReports}
                    title="Reportes"
                    style={{ justifyContent: 'center', marginTop: '0.25rem' }}
                  >
                    <span className="sidebar-item-icon">
                      <BarChart3 size={18} />
                    </span>
                  </button>
                )}
              </>
            ) : (
              /* User: solo "Tareas" */
              !isCollapsed && (
                <div className="sidebar-section">
                  <span className="sidebar-section-title">TAREAS</span>
                  <div className="sidebar-item sidebar-static-item">
                    <span className="sidebar-item-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="9" x2="15" y2="9"/>
                        <line x1="9" y1="13" x2="15" y2="13"/>
                        <line x1="9" y1="17" x2="13" y2="17"/>
                      </svg>
                    </span>
                    <span className="sidebar-item-label">Mis tareas</span>
                  </div>
                </div>
              )
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
