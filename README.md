# Benso - Consultoría y Soluciones Digitales

Sitio web de Benso, una consultoría de soluciones digitales para PyMEs.

## Tecnologías

- **React 19** - Librería de UI moderna
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Build tool rápido y moderno
- **React Router** - Enrutamiento con HashRouter (compatible con GitHub Pages)

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BentoCard.tsx
│   ├── FAQAccordion.tsx
│   └── Icon.tsx
├── pages/           # Páginas de la aplicación
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── AboutPage.tsx
│   ├── EventsPage.tsx
│   └── ContactPage.tsx
├── App.tsx          # Componente principal con rutas
├── main.tsx         # Punto de entrada
└── index.css        # Estilos globales
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa del build
npm run preview

# Ejecutar linter
npm run lint
```

## Despliegue

El sitio se despliega automáticamente en GitHub Pages a través de GitHub Actions cuando se hace push a la rama `main`.

URL: https://bensofcg.github.io/benso/

## Preparado para shadcn/ui

El proyecto está configurado con:
- TypeScript
- Path aliases (`@/`)
- Vite como bundler
- Estructura de componentes modular

Esto facilita la futura integración con shadcn/ui cuando sea necesario.
