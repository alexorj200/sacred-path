import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import logoCross from "@/assets/logo-cross.png";
import BibliotecaEspiritual from "@/pages/BibliotecaEspiritual";
import AdminPanel from "@/pages/AdminPanel";

import { Shield, TrendingUp, KeyRound, Sparkles } from "lucide-react";

const courses = [
  {
    title: "Camino de Protección",
    description: "Aprende a cubrir tu vida y tu familia con la armadura espiritual que Dios ha preparado para ti.",
    icon: Shield,
    color: "from-primary to-primary/70",
  },
  {
    title: "Camino de Prosperidad",
    description: "Descubre los principios bíblicos de abundancia y mayordomía fiel para transformar tu vida.",
    icon: TrendingUp,
    color: "from-accent to-accent/70",
  },
  {
    title: "Camino de Liberación",
    description: "Un recorrido guiado para romper cadenas y vivir en la libertad que Cristo ofrece.",
    icon: KeyRound,
    color: "from-sidebar-background to-sidebar-accent",
  },
  {
    title: "Camino de Milagros",
    description: "Fortalece tu fe y abre tu corazón a lo sobrenatural a través de la oración y la Palabra.",
    icon: Sparkles,
    color: "from-ring to-ring/60",
  },
];

const DashboardHome = () => {
  const displayName = "peregrino";

  return (
    <>
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-display mb-2 text-foreground">
          Paz y Bendición, <span className="text-accent">{displayName}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
          Bienvenido a tu espacio espiritual. Aquí encontrarás caminos de crecimiento, enseñanzas y oraciones para transformar tu vida.
        </p>
      </div>

      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xl font-display mb-6 flex items-center gap-2">
          <span className="w-8 h-px bg-accent inline-block" />
          Cursos espirituales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.title}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              <div className="p-6 flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <course.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg mb-1 text-foreground">{course.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {course.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-display tracking-wider transition-colors"
                  >
                    Comenzar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

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
                <span className="font-display text-sm tracking-wide">Camino Sagrado</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-10 overflow-auto">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="biblioteca" element={<BibliotecaEspiritual />} />
              <Route path="admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
