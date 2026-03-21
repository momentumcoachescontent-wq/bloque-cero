import { useEffect, useState } from "react";
import { supabase, Database } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Sparkles, UserCheck } from "lucide-react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const UsersAdmin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Error cargando usuarios: " + error.message);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const togglePremium = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("profiles").update({ is_premium: !currentStatus }).eq("id", id);
    if (error) {
      toast.error("Fallo al actualizar acceso: " + error.message);
    } else {
      toast.success(currentStatus ? "Acceso Premium Revocado" : "Acceso Premium Concedido");
      setProfiles(p => p.map(x => x.id === id ? { ...x, is_premium: !currentStatus } : x));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-1">Concede privilegios, busca y administra a la comunidad de Bloque Cero.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol en Sistema</th>
                <th className="px-6 py-4">Status VIP</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Cargando base de datos...</td>
                </tr>
              ) : profiles.map((p) => (
                <tr key={p.id} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{p.full_name || "Sin nombre"}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                       {p.email} 
                       <button onClick={() => { navigator.clipboard.writeText(p.email); toast.success("Copiado"); }}><Copy className="w-3 h-3 hover:text-foreground cursor-pointer" /></button>
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${p.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.is_premium ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                        <Sparkles className="w-3 h-3" /> All Access
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Estándar (Freemium)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant={p.is_premium ? "outline" : "default"} 
                      size="sm" 
                      onClick={() => togglePremium(p.id, p.is_premium)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      {p.is_premium ? "Quitar Premium" : "Dar Premium"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersAdmin;
