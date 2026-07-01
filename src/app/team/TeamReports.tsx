'use client';

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { MonthlyReportRow } from '@/types/team';

// ─────────────────────────────────────────────
// Props Interface
// ─────────────────────────────────────────────

export interface TeamReportsProps {
  monthlyReport: MonthlyReportRow[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  reportMonths: Array<{ key: string; label: string; isFake: boolean }>;
}

// ─────────────────────────────────────────────
// ReportRow Sub-component
// ─────────────────────────────────────────────

function ReportRow({ row }: { row: MonthlyReportRow }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
        className={open ? 'report-row-expanded' : ''}
      >
        <td>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
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
// TeamReports Component
// ─────────────────────────────────────────────

export default function TeamReports({
  monthlyReport,
  selectedMonth,
  onMonthChange,
  reportMonths,
}: TeamReportsProps) {
  return (
    <div className="report-page">
      {/* Month tabs */}
      <div className="report-tabs">
        {reportMonths.map((m) => {
          const isActive = selectedMonth === m.key;
          return (
            <button
              key={m.key}
              className={`report-tab${isActive ? ' active' : ''}`}
              onClick={() => {
                if (isActive) return;
                onMonthChange(m.key);
              }}
            >
              {m.label}
              {m.isFake && <span className="report-tab-badge">Archivado</span>}
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
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Miembro</th>
                <th style={{ textAlign: 'center' }}>Tareas</th>
                <th style={{ textAlign: 'right' }}>Total</th>
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
  );
}
