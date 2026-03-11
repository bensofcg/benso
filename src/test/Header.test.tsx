import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../components/Header';

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders the logo', () => {
    renderHeader();
    expect(screen.getByAltText('BENSO')).toBeInTheDocument();
  });

  it('renders the menu toggle button with correct ARIA attributes', () => {
    renderHeader();
    const toggles = screen.getAllByRole('button', { name: /menú de navegación/i });
    const toggle = toggles[0];
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'main-nav');
  });

  it('toggles aria-expanded when menu button is clicked', () => {
    renderHeader();
    const toggle = screen.getAllByRole('button', { name: /menú de navegación/i })[0];

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders all navigation links', () => {
    renderHeader();
    expect(screen.getAllByText('Inicio').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Servicios').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Productos').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Nosotros').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Eventos').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contacto').length).toBeGreaterThanOrEqual(1);
  });
});
