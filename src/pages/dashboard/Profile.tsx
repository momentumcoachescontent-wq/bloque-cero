import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function Profile() {
  const { session, profile: authProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (authProfile) {
      setFormData({
        fullName: authProfile.full_name || "",
        whatsapp: authProfile.whatsapp || "",
      });
    }
  }, [authProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.fullName,
        whatsapp: formData.whatsapp,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    setLoading(false);

    if (error) {
      toast.error("Hubo un error al actualizar el perfil");
      console.error(error);
    } else {
      await refreshProfile();
      toast.success("Perfil actualizado correctamente");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Perfil</h1>
      <p className="text-muted-foreground mb-8">Administra tus datos personales y de contacto.</p>

      <form onSubmit={handleSave} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Datos Personales</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico (solo lectura)</Label>
            <Input id="email" value={session?.user?.email || ""} disabled className="bg-muted cursor-not-allowed" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input 
              id="fullName" 
              value={formData.fullName} 
              onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input 
              id="whatsapp" 
              value={formData.whatsapp} 
              onChange={e => setFormData(f => ({ ...f, whatsapp: e.target.value }))}
              placeholder="+52 55..."
            />
          </div>
        </div>

        {/* PROXIMAMENTE: Datos de empresa para alimentar el N8N */}
        <div className="space-y-4 pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Datos de Empresa</h3>
          <p className="text-xs text-muted-foreground">
            Los datos de registro de empresa se asociarán con tu cuenta próximamente en las iteraciones de la Fase 3.
          </p>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={loading} className="rounded-full px-8">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</> : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
