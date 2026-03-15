import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
}

interface ContentItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
}

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "video",
    thumbnail: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, email, name, role")
        .order("created_at", { ascending: true });

      if (usersError) console.error(usersError);
      else setUsers(usersData || []);

      const { data: contentData, error: contentError } = await supabase
        .from("content")
        .select("id, title, description, category, thumbnail")
        .order("created_at", { ascending: true });

      if (contentError) console.error(contentError);
      else setContent(contentData || []);
    };

    loadData();
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveContent = async () => {
    if (editingContent) {
      const { error } = await supabase
        .from("content")
        .update(formData)
        .eq("id", editingContent.id);
      if (error) console.error(error);
      else setContent((prev) =>
        prev.map((c) => (c.id === editingContent.id ? { ...c, ...formData } : c))
      );
    } else {
      const { data, error } = await supabase.from("content").insert([formData]).select();
      if (error) console.error(error);
      else if (data && data[0]) setContent((prev) => [...prev, data[0]]);
    }

    setShowDialog(false);
    setEditingContent(null);
    setFormData({ title: "", description: "", category: "video", thumbnail: "" });
  };

  const handleEdit = (item: ContentItem) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      thumbnail: item.thumbnail || "",
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("content").delete().eq("id", id);
    if (error) console.error(error);
    else setContent((prev) => prev.filter((c) => c.id !== id));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-display text-gold mb-6">Panel de Administración</h1>

      <section className="mb-10">
        <h2 className="text-xl font-display mb-4">Usuarios</h2>
        <table className="w-full border border-border rounded-lg overflow-hidden">
          <thead className="bg-card">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-display mb-4">Contenido</h2>
        <Button
          onClick={() => {
            setEditingContent(null);
            setFormData({ title: "", description: "", category: "video", thumbnail: "" });
            setShowDialog(true);
          }}
          className="mb-4 border-gold text-gold"
        >
          Crear nuevo contenido
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.map((item) => (
            <div
              key={item.id}
              className="bg-card p-4 rounded-lg shadow-warm flex flex-col gap-2"
            >
              <h3 className="font-display text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingContent ? "Editar Contenido" : "Crear Contenido"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Input placeholder="Título" name="title" value={formData.title} onChange={handleFormChange} />
              <Input placeholder="Descripción" name="description" value={formData.description} onChange={handleFormChange} />
              <select name="category" value={formData.category} onChange={handleFormChange} className="border border-border p-2 rounded-lg">
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="libro">Libro</option>
              </select>
              <Input placeholder="Thumbnail URL" name="thumbnail" value={formData.thumbnail} onChange={handleFormChange} />
              <Button onClick={handleSaveContent} className="border-gold text-gold">Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
};

export default AdminPanel;