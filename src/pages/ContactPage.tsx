import { useState, type FormEvent } from 'react';
import { BentoCard, FAQAccordion, ScrollReveal } from '../components';
import faqItems from '../data/faqs.json';
import servicesData from '../data/services.json';

const serviceOptions = servicesData.all.map(s => s.title);

export function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    servicio: ''
  });
  const [errors, setErrors] = useState({
    nombre: false,
    fecha: false,
    servicio: false
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      nombre: !formData.nombre.trim(),
      fecha: !formData.fecha.trim(),
      servicio: false
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      alert('Por favor, complete todos los campos requeridos del formulario.');
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
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
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
            <BentoCard style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Formulario de Contacto</h3>
              <form id="appointment-form" style={{ textAlign: 'left' }} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    required 
                    aria-required="true"
                    value={formData.nombre}
                    onChange={handleChange('nombre')}
                    style={{ borderColor: errors.nombre ? '#e74c3c' : undefined }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fecha">Fecha preferida para la cita</label>
                  <input 
                    type="date" 
                    id="fecha" 
                    name="fecha" 
                    required 
                    aria-required="true"
                    value={formData.fecha}
                    onChange={handleChange('fecha')}
                    style={{ borderColor: errors.fecha ? '#e74c3c' : undefined }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="servicio">Servicio de interés</label>
                  <select
                    id="servicio"
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleChange('servicio')}
                    style={{ borderColor: errors.servicio ? '#e74c3c' : undefined }}
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
