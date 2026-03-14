import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Volume2, FileText, Video, Headphones, BookOpen } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

import thumbVideo from "@/assets/thumb-video.jpg";
import thumbAudio from "@/assets/thumb-audio.jpg";
import thumbBook from "@/assets/thumb-book.jpg";

// --- Tipos e mock ---
type ContentType = "video" | "audio" | "libro";

interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  description: string;
  thumbnail: string;
}

const mockContent: ContentItem[] = [
  {
    id: 1,
    type: "video",
    title: "Introducción a la Regla de San Benito",
    description: "Una guía visual sobre los principios fundamentales de la vida benedictina.",
    thumbnail: thumbVideo,
  },
  {
    id: 2,
    type: "video",
    title: "La Oración en la Tradición Monástica",
    description: "Descubre cómo los monjes estructuran su día alrededor de la oración.",
    thumbnail: thumbVideo,
  },
  {
    id: 3,
    type: "audio",
    title: "Canto Gregoriano: Vísperas",
    description: "Escucha los cantos sagrados de la oración vespertina monástica.",
    thumbnail: thumbAudio,
  },
  {
    id: 4,
    type: "audio",
    title: "Meditación Guiada: Silencio Interior",
    description: "Una meditación de 15 minutos inspirada en la espiritualidad benedictina.",
    thumbnail: thumbAudio,
  },
  {
    id: 5,
    type: "libro",
    title: "Lectio Divina: Manual Práctico",
    description: "Aprende paso a paso la antigua práctica de la lectura sagrada.",
    thumbnail: thumbBook,
  },
  {
    id: 6,
    type: "libro",
    title: "Los Salmos en la Vida Cotidiana",
    description: "Cómo integrar la sabiduría de los Salmos en tu rutina diaria.",
    thumbnail: thumbBook,
  },
];

const tabIcon: Record<string, React.ReactNode> = {
  videos: <Video className="h-4 w-4" />,
  audios: <Headphones className="h-4 w-4" />,
  libros: <BookOpen className="h-4 w-4" />,
};

// --- Visualizador de conteúdo ---
function ContentViewer({ item }: { item: ContentItem }) {
  if (item.type === "video") {
    return (
      <div className="aspect-video bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Play className="h-8 w-8 text-gold ml-1" />
        </div>
        <p className="text-muted-foreground text-sm">Reproductor de video</p>
      </div>
    );
  }
  if (item.type === "audio") {
    return (
      <div className="space-y-4">
        <div className="aspect-[3/1] bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-3">
          <Volume2 className="h-10 w-10 text-gold" />
          <p className="text-muted-foreground text-sm">Reproductor de audio</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            className="border-gold text-gold hover:bg-gold hover:text-accent-foreground rounded-full h-10 w-10"
          >
            <Play className="h-4 w-4 ml-0.5" />
          </Button>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gold rounded-full" />
          </div>
          <span className="text-xs text-muted-foreground">3:42</span>
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

// --- Card de conteúdo ---
function ContentCard({ item, onOpen }: { item: ContentItem; onOpen: () => void }) {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-warm hover:shadow-gold transition-shadow duration-300">
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
            <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
              <Play className="h-5 w-5 text-gold ml-0.5" />
            </div>
          </div>
        )}
        {item.type === "audio" && (
          <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center">
            <Volume2 className="h-4 w-4 text-gold" />
          </div>
        )}
        {item.type === "libro" && (
          <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center">
            <FileText className="h-4 w-4 text-gold" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg mb-2">{item.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpen}
          className="border-gold text-gold hover:bg-gold hover:text-accent-foreground font-display tracking-wider transition-colors"
        >
          Ver contenido
        </Button>
      </div>
    </div>
  );
}

// --- BibliotecaEspiritual com proteção de rota ---
const BibliotecaEspiritual = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ContentItem | null>(null);

  // Proteção de rota
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const filterByType = (type: ContentType) => mockContent.filter((c) => c.type === type);

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

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-card border border-border mb-8">
            {["videos", "audios", "libros"].map((tab) => (
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

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("video").map((item) => (
                <ContentCard key={item.id} item={item} onOpen={() => setSelected(item)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audios">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("audio").map((item) => (
                <ContentCard key={item.id} item={item} onOpen={() => setSelected(item)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="libros">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("libro").map((item) => (
                <ContentCard key={item.id} item={item} onOpen={() => setSelected(item)} />
              ))}
            </div>
          </TabsContent>
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
