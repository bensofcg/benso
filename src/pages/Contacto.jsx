import Footer from '../components/Footer';

export default function Contacto() {
  return (
    <>
      <section className="pt-28 pb-20 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[2.5rem] text-primary mb-4 relative inline-block font-bold">
              Agenda tu Cita
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[60px] h-1 bg-accent rounded" />
            </h2>
            <p className="text-dark/70 text-lg">Completa el formulario y te contactaremos por WhatsApp</p>
          </div>
          
          <div className="text-center py-16">
            <p className="text-lg text-dark/60">Formulario de contacto próximamente...</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
