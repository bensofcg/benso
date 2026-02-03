import { useState, type FormEvent } from 'react';
import { BentoCard, FAQAccordion } from '../components';

const faqItems = [
  {
    question: '¿Cómo funciona la primera consulta?',
    answer: 'La primera consulta es gratuita. Agendamos una videollamada de 30 minutos para conocer tu negocio, entender tus desafíos y explicarte cómo podemos ayudarte. No hay compromiso y recibirás recomendaciones iniciales sin costo.'
  },
  {
    question: '¿Trabajan con negocios de cualquier tamaño?',
    answer: 'Nos especializamos en PyMEs y emprendimientos. Si tienes un negocio pequeño o mediano, somos la opción ideal. Nuestros servicios están diseñados específicamente para las necesidades y presupuestos de este tipo de empresas.'
  },
  {
    question: '¿Cuánto tiempo toma ver resultados?',
    answer: 'Depende del servicio contratado. Generalmente, comenzarás a ver mejoras en los primeros 30-60 días de trabajo conjunto. En capacitaciones, el impacto puede ser inmediato al aplicar los conocimientos adquiridos.'
  },
  {
    question: '¿Ofrecen planes de pago?',
    answer: 'Sí, ofrecemos opciones de financiamiento y planes de pago flexibles para que puedas acceder a nuestros servicios. Consultanos por las opciones disponibles según el servicio que te interese.'
  },
  {
    question: '¿Qué incluye el diagnóstico empresarial?',
    answer: 'Incluye análisis FODA completo, revisión de procesos operativos, análisis financiero, identificación de áreas de mejora y un plan de acción personalizado con recomendaciones específicas para tu negocio.'
  },
  {
    question: '¿Trabajan de forma presencial o remota?',
    answer: 'Ofrecemos ambas modalidades. Podemos trabajar de forma remota mediante videollamadas y herramientas digitales, o presencial según tu ubicación y preferencia. La mayoría de nuestros servicios pueden realizarse completamente online.'
  }
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    fecha: ''
  });
  const [errors, setErrors] = useState({
    nombre: false,
    empresa: false,
    fecha: false
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      nombre: !formData.nombre.trim(),
      empresa: !formData.empresa.trim(),
      fecha: !formData.fecha.trim()
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      alert('Por favor, complete todos los campos del formulario.');
      return;
    }
    
    // Sanitize inputs
    const sanitizedNombre = formData.nombre.replace(/[<>]/g, '');
    const sanitizedEmpresa = formData.empresa.replace(/[<>]/g, '');
    const sanitizedFecha = formData.fecha.replace(/[<>]/g, '');
    
    const message = `Hola, mi nombre es ${sanitizedNombre}, mi empresa es ${sanitizedEmpresa} y quiero agendar una cita el ${sanitizedFecha}`;
    const whatsappUrl = `https://wa.me/5355609099?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <>
      {/* Agendar Cita Section */}
      <section style={{ paddingTop: '7rem' }}>
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
                  <label htmlFor="nombre">Nombre completo</label>
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
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text" 
                    id="empresa" 
                    name="empresa" 
                    required 
                    aria-required="true"
                    value={formData.empresa}
                    onChange={handleChange('empresa')}
                    style={{ borderColor: errors.empresa ? '#e74c3c' : undefined }}
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
                <button type="submit" className="btn-submit" style={{ background: '#25D366' }}>
                  Enviar por WhatsApp
                </button>
              </form>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>Preguntas Frecuentes</h2>
            <p>Encuentra respuestas a las dudas más comunes</p>
          </div>
          
          <FAQAccordion items={faqItems} />
        </div>
      </section>
    </>
  );
}
