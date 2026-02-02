import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, HelpCircle, Keyboard, Quote } from 'lucide-react';
import Footer from '../components/Footer';

const rotatingWords = ['Rentabilidad', 'Crecimiento', 'Futuro'];

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // Rotating text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: '¿Cómo funciona la primera consulta?',
      answer: 'La primera consulta es gratuita. Agendamos una videollamada de 30 minutos para conocer tu negocio, entender tus desafíos y explicarte cómo podemos ayudarte. No hay compromiso y recibirás recomendaciones iniciales sin costo.',
    },
    {
      question: '¿Trabajan con negocios de cualquier tamaño?',
      answer: 'Nos especializamos en PyMEs y emprendimientos. Si tienes un negocio pequeño o mediano, somos la opción ideal. Nuestros servicios están diseñados específicamente para las necesidades y presupuestos de este tipo de empresas.',
    },
    {
      question: '¿Cuánto tiempo toma ver resultados?',
      answer: 'Depende del servicio contratado. Generalmente, comenzarás a ver mejoras en los primeros 30-60 días de trabajo conjunto. En capacitaciones, el impacto puede ser inmediato al aplicar los conocimientos adquiridos.',
    },
    {
      question: '¿Ofrecen planes de pago?',
      answer: 'Sí, ofrecemos opciones de financiamiento y planes de pago flexibles para que puedas acceder a nuestros servicios. Consultanos por las opciones disponibles según el servicio que te interese.',
    },
    {
      question: '¿Qué incluye el diagnóstico empresarial?',
      answer: 'Incluye análisis FODA completo, revisión de procesos operativos, análisis financiero, identificación de áreas de mejora y un plan de acción personalizado con recomendaciones específicas para tu negocio.',
    },
    {
      question: '¿Trabajan de forma presencial o remota?',
      answer: 'Ofrecemos ambas modalidades. Podemos trabajar de forma remota mediante videollamadas y herramientas digitales, o presencial según tu ubicación y preferencia. La mayoría de nuestros servicios pueden realizarse completamente online.',
    },
  ];

  const services = [
    {
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: 'Formación Empresarial',
      tags: ['Capacitación', 'Consultar precio'],
      description: 'Programas de capacitación diseñados para desarrollar las habilidades digitales y financieras de tu equipo.',
      whatsappUrl: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Formación%20Empresarial',
    },
    {
      icon: <HelpCircle className="w-12 h-12 text-primary" />,
      title: 'Consultoría Personalizada',
      tags: ['Asesoramiento', 'Consultar precio'],
      description: 'Análisis profundo de tu negocio con estrategias personalizadas para maximizar tu rentabilidad.',
      whatsappUrl: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Consultoría%20Personalizada',
    },
    {
      icon: <Keyboard className="w-12 h-12 text-primary" />,
      title: 'Soluciones a Medida',
      tags: ['Herramientas Digitales', 'Consultar precio'],
      description: 'Desarrollo de herramientas digitales personalizadas que automatizan y optimizan tus procesos.',
      whatsappUrl: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Soluciones%20a%20Medida',
    },
  ];

  const events = [
    {
      title: 'Masterclass de E-commerce',
      status: 'Próximamente',
      date: 'Enero 2025',
      description: 'Todo lo que necesitas saber para vender online y escalar tu negocio digital.',
      whatsappUrl: 'https://wa.me/5355609099?text=Hola%2C%20quiero%20inscribirme%20al%20evento%20Masterclass%20de%20E-commerce',
    },
    {
      title: 'Bootcamp Emprendedor',
      status: 'Próximamente',
      date: 'Febrero 2025',
      description: 'Programa intensivo de 4 semanas para acelerar el crecimiento de tu emprendimiento.',
      whatsappUrl: 'https://wa.me/5355609099?text=Hola%2C%20quiero%20inscribirme%20al%20evento%20Bootcamp%20Emprendedor',
    },
  ];

  const testimonials = [
    {
      text: 'Benso transformó nuestra gestión financiera completamente. En solo tres meses logramos optimizar nuestros costos operativos en un 30% y mejorar nuestro flujo de caja significativamente.',
      author: 'María González',
      role: 'CEO, Logística Global',
    },
    {
      text: 'La capacitación que recibió nuestro equipo fue excepcional. Los conceptos complejos se explicaron de manera clara y práctica. Ahora tenemos herramientas concretas para crecer.',
      author: 'Carlos Ramírez',
      role: 'Director, Tech Innovations',
    },
    {
      text: 'El diagnóstico empresarial que nos brindaron fue revelador. Identificaron oportunidades que no habíamos considerado y nos dieron un plan de acción claro para implementar.',
      author: 'Ana Patricia Silva',
      role: 'Fundadora, Consultoría Empresarial Plus',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-accent relative text-white py-24 text-center min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none" />
        <div className="max-w-[800px] mx-auto relative z-10 px-5">
          <h1 className="text-[2.5rem] md:text-[3rem] mb-4 uppercase tracking-[4px] animate-fadeInUp font-bold">
            BENSO
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-6 animate-fadeInUpSlogan min-h-[1.9em]">
            Consultoría y Soluciones Digitales para la{' '}
            <span
              className={`text-accent font-bold inline-block min-w-[150px] text-left rotating-text ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {rotatingWords[currentWordIndex]}
            </span>{' '}
            Sostenible
          </p>
          <Link
            to="/contacto"
            className="bg-white text-primary py-4 px-10 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2 transition-all hover:bg-light hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
          >
            Agendar cita
            <Calendar className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[2.5rem] text-primary mb-4 relative inline-block font-bold">
              Nuestros Servicios
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[60px] h-1 bg-accent rounded" />
            </h2>
            <p className="text-dark/70 text-lg">Soluciones integrales para potenciar tu negocio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-benso p-8 shadow-benso transition-all hover:-translate-y-[5px] hover:shadow-benso-hover border border-light flex flex-col gap-4"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-primary text-xl font-bold">{service.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="border border-primary text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-dark/80 flex-grow">{service.description}</p>
                <a
                  href={service.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-white py-3 px-6 rounded-lg font-semibold text-center transition-all hover:bg-secondary mt-auto"
                >
                  Solicitar servicio
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/servicios"
              className="bg-primary text-white py-4 px-10 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2 transition-all hover:bg-secondary"
            >
              Ver Todos los Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Current Events Section */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[2.5rem] text-primary mb-4 relative inline-block font-bold">
              Próximos Eventos
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[60px] h-1 bg-accent rounded" />
            </h2>
            <p className="text-dark/70 text-lg">Próximas capacitaciones y actividades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-benso p-8 shadow-benso transition-all hover:-translate-y-[5px] hover:shadow-benso-hover border border-light flex flex-col gap-4"
              >
                <h3 className="text-primary text-xl font-bold">{event.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-primary text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {event.status}
                  </span>
                  <span className="border border-primary text-primary px-3 py-1 rounded-full text-sm">
                    {event.date}
                  </span>
                </div>
                <p className="text-dark/80 flex-grow">{event.description}</p>
                <a
                  href={event.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-white py-3 px-6 rounded-lg font-semibold text-center transition-all hover:bg-secondary mt-auto"
                >
                  Inscribirme
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/eventos"
              className="bg-primary text-white py-4 px-10 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2 transition-all hover:bg-secondary"
            >
              Ver Más Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[2.5rem] text-primary mb-4 relative inline-block font-bold">
              Lo que dicen nuestros clientes
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[60px] h-1 bg-accent rounded" />
            </h2>
            <p className="text-dark/70 text-lg">Testimonios reales de empresas que han confiado en nosotros</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-benso p-8 shadow-benso transition-all hover:-translate-y-[5px] hover:shadow-benso-hover border border-light flex flex-col"
              >
                <div className="mb-4">
                  <Quote className="w-12 h-12 text-accent/30" />
                </div>
                <p className="italic leading-relaxed text-dark/80 mb-6 flex-grow">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex flex-col gap-1 border-t-2 border-light pt-4">
                  <strong className="text-primary text-lg">{testimonial.author}</strong>
                  <span className="text-dark/70 text-sm">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[2.5rem] text-primary mb-4 relative inline-block font-bold">
              Preguntas Frecuentes
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[60px] h-1 bg-accent rounded" />
            </h2>
            <p className="text-dark/70 text-lg">Encuentra respuestas a las dudas más comunes</p>
          </div>

          <div className="max-w-[800px] mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-benso mb-4 overflow-hidden shadow-benso border border-light"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 bg-white border-none text-lg font-semibold text-primary cursor-pointer flex justify-between items-center transition-colors hover:bg-light"
                  aria-expanded={openFaq === index}
                >
                  {faq.question}
                  <span className="text-2xl font-bold leading-none">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-dark/80 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-primary mb-4 text-2xl font-bold">¿Listo para transformar tu negocio?</h2>
          <p className="mb-8 opacity-80">Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
          <a
            href="https://wa.me/5355609099?text=Hola%2C%20me%20gustaría%20agendar%20una%20cita%20para%20consultoría"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white py-4 px-10 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2 transition-all hover:bg-[#128C7E]"
          >
            Agenda tu cita
            <Calendar className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
