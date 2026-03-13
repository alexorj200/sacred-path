import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logoCross from "@/assets/logo-cross.png";
import heroImg from "@/assets/hero-monastery.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={heroImg} alt="Monastery interior" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-monastery-dark/60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <img src={logoCross} alt="Cross" className="w-20 h-20 mb-6 opacity-90" />
          <h2 className="font-display text-3xl text-parchment mb-3">Camino Sagrado de San Benito</h2>
          <p className="text-gold-light font-body text-lg italic max-w-md">
            "Ora et Labora" — Reza y Trabaja
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img src={logoCross} alt="Cross" className="w-14 h-14 mb-3" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-display text-center mb-2">
            Bienvenido al Mosteiro São Bento
          </h1>
          <p className="text-muted-foreground text-center mb-8 italic">
            Un camino espiritual guiado por la tradición monástica.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border focus:ring-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card border-border focus:ring-gold"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wider">
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link to="/forgot-password" className="text-sm text-gold hover:text-gold-light transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-gold hover:text-gold-light font-medium transition-colors">
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
