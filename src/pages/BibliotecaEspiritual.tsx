import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Volume2, FileText, Video, Headphones, BookOpen, CheckCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseService";

type ContentCategory = "video" | "audio" | "libro";

interface ContentItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
}

const tabIcon: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  audio: <Headphones className="h-4 w-4" />,
  libro: <BookOpen className="h-4 w-4" />,
};

function ContentViewer({ item }: { item: ContentItem }) {
  if (item.category === "video") {
    return (
      <div className="aspect-video bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Play className="h-8 w-8 text-gold ml-1" />
        </div>
        <p className="text-muted-foreground text-sm">Reproductor de video</p>
      </div>
    );
  }
  if (item.category === "audio") {
    return (
      <div className="space-y-4">
        <div className="aspect-[3/1] bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-3">
          <Volume2 className="h-10 w-10 text-gold" />
          <p className="text-muted-foreground text-sm">Reproductor de audio</p>
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-[3/4] bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-3 max-h-[50vh]">
      <FileText className="h-12 w-12 text-gold" />
      <p className="text-muted-foreground text-sm">Visor de PDF</p>
      <p className="text-muted-foreground text-xs">Documento disponible para lectura</p>
    </div>
  );
}

function ContentCard({
  item,
  completed,
  onOpen,
  onComplete,
}: {
  item: ContentItem;
  completed: boolean;
  onOpen: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-warm hover:shadow-gold transition-shadow duration-300 relative">
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={item.thumbnail || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {completed && <CheckCircle className="absolute top-2 right-2 h-6 w-6 text-green-500" />}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg mb-2">{item.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpen}
            className="border-gold text-gold hover:bg-gold hover:text-accent-foreground font-display tracking-wider transition-colors"
          >
            Ver contenido
          </Button>
          <Button
            variant={completed ? "secondary" : "outline"}
            size="sm"
            onClick={onComplete}
            className="border-gold text-gold hover:bg-gold hover:text-accent-foreground font-display tracking-wider transition-colors"
          >
            {completed ? "Completado" : "Marcar como completo"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const BibliotecaEspiritual = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadContent = async () => {
      const { data: contents, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) console.error(error);
      else setContent(contents || []);

      const { data: progData, error: progError } = await supabase
        .from("progress")
        .select("content_id")
        .eq("user_id", user.id);

      if (progError) console.error(progError);
      else setProgress((progData || []).map((p) => p.content_id));
    };

    loadContent();
  }, [user]);

  const handleComplete = async (item: ContentItem) => {
    if (!user) return;
    if (progress.includes(item.id)) return;

    const { error } = await supabase.from("progress").insert([
      { user_id: user.id, content_id: item.id, completed: true },
    ]);

    if (error) console.error(error);
    else setProgress((prev) => [...prev, item.id]);
  };

  const filterByCategory = (cat: ContentCategory) =>
    content.filter((c) => c.category === cat);

  if (!user) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <>
      <div className="animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display mb-3 text-gold">
            Biblioteca Espiritual
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
            Enseñanzas, oraciones y formación espiritual.
          </p>
        </div>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="bg-card border border-border mb-8">
            {(["video", "audio", "libro"] as ContentCategory[]).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="font-display tracking-wider data-[state=active]:bg-gold data-[state=active]:text-accent-foreground gap-2"
              >
                {tabIcon[tab]}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {(["video", "audio", "libro"] as ContentCategory[]).map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterByCategory(cat).map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    completed={progress.includes(item.id)}
                    onOpen={() => setSelected(item)}
                    onComplete={() => handleComplete(item)}
                  />
                ))}
                {filterByCategory(cat).length === 0 && (
                  <p className="text-muted-foreground">No hay contenido disponible.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && <ContentViewer item={selected} />}
          <p className="text-muted-foreground text-sm">{selected?.description}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BibliotecaEspiritual;