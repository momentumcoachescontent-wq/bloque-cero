import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Diagnostic from "./pages/Diagnostic.tsx";
import Privacidad from "./pages/Privacidad.tsx";
import Terminos from "./pages/Terminos.tsx";
import Contacto from "./pages/Contacto.tsx";

// Dashboard Cliente
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import Profile from "./pages/dashboard/Profile";
import PremiumBlock from "./pages/dashboard/PremiumBlock";

// Admin Interface
import AdminLayout from "./layouts/AdminLayout";
import AdminIndex from "./pages/admin/AdminIndex";
import UsersAdmin from "./pages/admin/UsersAdmin";
import SystemAdmin from "./pages/admin/SystemAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min cache
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/diagnostico" element={<Diagnostic />} />

            {/* Páginas legales y contacto — Fase 2.5 */}
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/contacto" element={<Contacto />} />

            {/* Rutas del Dashboard de Cliente */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardIndex />} />
              <Route path="/dashboard/perfil" element={<Profile />} />
              <Route path="/dashboard/blueprint" element={
                <PremiumBlock 
                  title="Blueprint Operativo" 
                  description="Transforma tu negocio manual en un sistema predecible y documentado."
                  priceTag="OTC"
                  features={[
                    "Mapeo de procesos core",
                    "Estandarización de servicios",
                    "Eliminación de cuellos de botella",
                    "Preparación para escalabilidad y delegación"
                  ]}
                />
              } />
              <Route path="/dashboard/automatizaciones" element={
                <PremiumBlock 
                  title="Automatizaciones Base" 
                  description="Conecta tus herramientas y pon tu negocio en piloto automático."
                  priceTag="OTC"
                  features={[
                    "Integración N8N / Make",
                    "Flujos de nutrición y onboarding",
                    "Automatización de pagos y reportes",
                    "Liberación de hasta 15h semanales de trabajo manual"
                  ]}
                />
              } />
              <Route path="/dashboard/agentes-ia" element={
                <PremiumBlock 
                  title="Agentes IA Especializados" 
                  description="Implementa empleados digitales cognitivos para atención, ventas y operación."
                  priceTag="OTC"
                  features={[
                    "Asistentes de ventas 24/7 omnicanal",
                    "Operadores de soporte técnico de nivel 1",
                    "Generación de contenido y reportes en volumen",
                    "Reducción directa de costos operativos"
                  ]}
                />
              } />
            </Route>

            {/* Rutas del Centro de Administración */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminIndex />} />
              <Route path="/admin/usuarios" element={<UsersAdmin />} />
              <Route path="/admin/sistema" element={<SystemAdmin />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
