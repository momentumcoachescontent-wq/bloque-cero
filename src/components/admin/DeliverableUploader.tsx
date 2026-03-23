import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileType, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { FulfillmentItem } from "@/hooks/useFulfillmentQueue";

interface Props {
  item: FulfillmentItem;
  onUploadSuccess: () => void;
  children: React.ReactNode;
}

export const DeliverableUploader = ({ item, onUploadSuccess, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [uploadingFormat, setUploadingFormat] = useState<string | null>(null);

  // Maps display format to the DB column
  const getFormatRecordKey = (format: string) => {
    if (item.type === 'radar') return 'analysis_file_url'; // For leads table
    // For blueprint_requests table
    if (format === 'PDF Blueprint') return 'pdf_url';
    if (format === 'Pitch Deck') return 'presentation_url';
    if (format === 'Infografía') return 'infographic_url';
    return null;
  };

  const hasUploadedFile = (format: string) => {
    const key = getFormatRecordKey(format);
    if (!key) return false;
    // We cast to any because sourceData is highly polymorphic at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(item.sourceData as any)[key];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, format: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFormat(format);
    const bucket = item.type === 'radar' ? 'radar_deliverables' : 'blueprint_deliverables';
    const filePath = `${item.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;

      // 3. Save to Database
      const updateKey = getFormatRecordKey(format);
      if (!updateKey) throw new Error("Format not mapped to DB column.");

      const table = item.type === 'radar' ? 'leads' : 'blueprint_requests';
      const { error: dbError } = await supabase.from(table).update({ [updateKey]: publicUrl }).eq('id', item.id);
      
      if (dbError) throw dbError;

      toast.success(`Archivo subido correctamente para: ${format}`);
      onUploadSuccess();

    } catch (err: unknown) {
      toast.error("Error al subir el archivo: " + (err as Error).message);
    } finally {
      setUploadingFormat(null);
      // Let the user visually see success, dialog stays open so they can upload others if Blueprint
      setTimeout(() => {
        if (item.type === 'radar') setOpen(false);
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" />
            Ingesta de Entregables
          </DialogTitle>
          <DialogDescription>
            Sube los archivos generados para el proyecto de <strong>{item.clientName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {item.formats.map((format, idx) => {
            const isUploaded = hasUploadedFile(format);
            const isUploading = uploadingFormat === format;

            return (
              <div key={idx} className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-muted/10">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <FileType className="w-4 h-4 text-muted-foreground" />
                    {format}
                  </span>
                  {isUploaded && (
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Archivo Asignado
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  {isUploading ? (
                    <Button size="sm" variant="outline" disabled className="w-24">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </Button>
                  ) : (
                    <Button size="sm" variant={isUploaded ? "secondary" : "default"} className="w-24 relative overflow-hidden">
                      {isUploaded ? 'Reemplazar' : 'Subir'}
                      <input 
                        type="file" 
                        accept=".pdf,.ppt,.pptx,.png,.jpg,application/pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => handleFileUpload(e, format)}
                      />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </DialogContent>
    </Dialog>
  );
};
