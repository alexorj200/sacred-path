import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import logoCross from "@/assets/logo-cross.png";
import cardScripture from "@/assets/card-scripture.jpg";
import cardJourney from "@/assets/card-journey.jpg";
import cardPrayer from "@/assets/card-prayer.jpg";
import BibliotecaEspiritual from "@/pages/BibliotecaEspiritual";

const featuredContent = [
  {
    image: cardScripture,
    title: "Lectio Divina",
    description: "Descubre la antigua práctica de la lectura sagrada y cómo puede transformar tu vida espiritual.",
  },
  {
    image: cardJourney,
    title: "Camino Benedictino",
    description: "Un recorrido de 30 días por la Regla de San Benito para cultivar la paz interior.",
  },
  {
    image: cardPrayer,
    title: "Liturgia de las Horas",
    description: "Oraciones guiadas siguiendo el ritmo monástico de oración a lo largo del día.",
  },
];

const DashboardHome = () => (
  <>
    <div className="mb-10 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-display mb-3 text-gold">
        Paz y Bendición
      </h1>
      <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
        Bienvenido a tu espacio espiritual. Aquí encontrarás enseñanzas, oraciones y caminos
        de crecimiento inspirados por la tradición de San Benito.
      </p>
    </div>

    <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-xl font-display mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-gold inline-block" />
        Contenido destacado
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredContent.map((item) => (
          <div
            key={item.title}
            className="group bg-card rounded-lg overflow-hidden shadow-warm hover:shadow-gold transition-shadow duration-300"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {item.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-gold text-gold hover:bg-gold hover:text-accent-foreground font-display tracking-wider transition-colors"
              >
                Ver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </>
);

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <img src={logoCross} alt="Logo" className="w-6 h-6 lg:hidden" />
                <span className="font-display text-sm tracking-wide"><span className="font-display text-sm tracking-wide">Camino Sagrado</span></span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-10 overflow-auto">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="biblioteca" element={<BibliotecaEspiritual />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
