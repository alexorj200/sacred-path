import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoCross from "@/assets/logo-cross.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <img src={logoCross} alt="Cross" className="w-14 h-14 mb-3" />
          <h1 className="text-2xl md:text-3xl font-display text-center mb-2">Recuperar Acceso</h1>
          <p className="text-muted-foreground text-center italic">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4 p-6 bg-card rounded-lg shadow-warm">
            <p className="text-foreground">Se ha enviado un enlace de recuperación a tu correo electrónico.</p>
            <Link to="/login" className="text-gold hover:text-gold-light font-medium transition-colors text-sm">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card" required />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wider"
            >
              {loading ? "Enviando..." : "Recuperar acceso"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-gold hover:text-gold-light font-medium transition-colors">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
