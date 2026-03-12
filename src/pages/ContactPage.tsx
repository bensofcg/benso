import { useState, type FormEvent } from 'react';
import { BentoCard, FAQAccordion, ScrollReveal } from '../components';
import faqItems from '../data/faqs.json';
import servicesData from '../data/services.json';

const serviceOptions = servicesData.all.map(s => s.title);

export function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    fecha: '',
    servicio: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'nombre':
        return value.trim() ? '' : 'El nombre es obligatorio.';
      case 'email':
        if (!value.trim()) return 'El correo electrónico es obligatorio.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Introduce un correo electrónico válido.';
        return '';
      case 'fecha':
        return value.trim() ? '' : 'La fecha es obligatoria.';
      default:
        return '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    for (const field of ['nombre', 'email', 'fecha'] as const) {
      const msg = validateField(field, formData[field]);
      if (msg) newErrors[field] = msg;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    // Sanitize inputs
    const sanitizedNombre = formData.nombre.replace(/[<>]/g, '');
    const sanitizedFecha = formData.fecha.replace(/[<>]/g, '');
    const sanitizedServicio = formData.servicio.replace(/[<>]/g, '') || 'sus servicios';
    
    const message = `Hola, soy ${sanitizedNombre}. Quiero agendar una cita para el ${sanitizedFecha} para consultar sobre ${sanitizedServicio}.`;
    const whatsappUrl = `https://wa.me/5355609099?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const msg = validateField(field, value);
      setErrors(prev => {
        const next = { ...prev };
        if (msg) {
          next[field] = msg;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  return (
    <>
      {/* Agendar Cita Section */}
      <ScrollReveal style={{ paddingTop: '7rem' }}>
        <div className="container">
          <div className="section-title">
            <h2>Agenda tu Cita</h2>
            <p>Completa el formulario y te contactaremos por WhatsApp</p>
          </div>
          
          <div className="text-center">
            <BentoCard className="contact-form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Formulario de Contacto</h3>
              <form id="appointment-form" style={{ textAlign: 'left' }} onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    required 
                    aria-required="true"
                    aria-invalid={!!errors.nombre}
                    value={formData.nombre}
                    onChange={handleChange('nombre')}
                    style={{ borderColor: errors.nombre ? '#e74c3c' : undefined }}
                  />
                  {errors.nombre && <span className="form-error">{errors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="ejemplo@correo.com"
                    style={{ borderColor: errors.email ? '#e74c3c' : undefined }}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="fecha">Fecha preferida para la cita *</label>
                  <input 
                    type="date" 
                    id="fecha" 
                    name="fecha" 
                    required 
                    aria-required="true"
                    aria-invalid={!!errors.fecha}
                    value={formData.fecha}
                    onChange={handleChange('fecha')}
                    style={{ borderColor: errors.fecha ? '#e74c3c' : undefined }}
                  />
                  {errors.fecha && <span className="form-error">{errors.fecha}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="servicio">Servicio de interés</label>
                  <select
                    id="servicio"
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleChange('servicio')}
                  >
                    <option value="">Selecciona un servicio (opcional)</option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-submit" style={{ background: '#25D366' }}>
                  Enviar por WhatsApp
                </button>
              </form>
            </BentoCard>
          </div>
        </div>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>Preguntas Frecuentes</h2>
            <p>Encuentra respuestas a las dudas más comunes</p>
          </div>
          
          <FAQAccordion items={faqItems} />
        </div>
      </ScrollReveal>
    </>
  );
}
