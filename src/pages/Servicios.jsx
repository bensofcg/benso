import Footer from '../components/Footer';

export default function Servicios() {
  return (
    <>
      <section className="pt-28 pb-20 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[2.5rem] text-primary mb-4 relative inline-block font-bold">
              Nuestros Servicios
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[60px] h-1 bg-accent rounded" />
            </h2>
            <p className="text-dark/70 text-lg">Filtra por categoría para encontrar lo que necesitas</p>
          </div>
          
          <div className="text-center py-16">
            <p className="text-lg text-dark/60">Contenido de servicios próximamente...</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
