// Team page skeletons — matches existing skeleton-shimmer pattern from ProductSkeleton

function CardSkeleton() {
  return <div className="kanban-card skeleton-card" />;
}

function ColumnSkeleton() {
  return (
    <div className="kanban-column skeleton-card">
      <div className="kanban-column-header">
        <div className="skeleton-line skeleton-team-column-title" />
        <div className="skeleton-line skeleton-team-column-count" />
      </div>
      <div className="kanban-cards">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="kanban-board">
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="admin-table-wrapper skeleton-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cuenta vinculada</th>
            <th>Rol</th>
            <th style={{ width: '100px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td><div className="skeleton-line skeleton-team-name" /></td>
              <td><div className="skeleton-line skeleton-team-email" /></td>
              <td><div className="skeleton-line skeleton-team-badge" /></td>
              <td>
                <div className="skeleton-buttons" style={{ margin: 0, justifyContent: 'center' }}>
                  <div className="skeleton-icon" style={{ width: 28, height: 28, borderRadius: 6, margin: 0 }} />
                  <div className="skeleton-icon" style={{ width: 28, height: 28, borderRadius: 6, margin: 0 }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
