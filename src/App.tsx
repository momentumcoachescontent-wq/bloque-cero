import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Diagnostic from "./pages/Diagnostic.tsx";
import Privacidad from "./pages/Privacidad.tsx";
import Terminos from "./pages/Terminos.tsx";
import Contacto from "./pages/Contacto.tsx";
import BlueprintLanding from "./pages/BlueprintLanding.tsx";

// Dashboard Cliente
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import Profile from "./pages/dashboard/Profile";
import PremiumBlock from "./pages/dashboard/PremiumBlock";
import OperationalKit from "./pages/dashboard/OperationalKit";
// Admin Interface
import AdminLayout from "./layouts/AdminLayout";
import AdminIndex from "./pages/admin/AdminIndex";
import BlueprintPage from "./pages/dashboard/BlueprintPage";
import UsersAdmin from "./pages/admin/UsersAdmin";
import SystemAdmin from "./pages/admin/SystemAdmin";
import FulfillmentAdmin from "./pages/admin/FulfillmentAdmin";

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
            <Route path="/blueprint-info" element={<BlueprintLanding />} />

            {/* Rutas del Dashboard de Cliente */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardIndex />} />
              <Route path="/dashboard/perfil" element={<Profile />} />
              <Route path="/dashboard/blueprint" element={<BlueprintPage />} /> {/* Dashboard Forzado */}
              <Route path="/dashboard/mvp" element={
                <PremiumBlock 
                  title="MVP de Validación" 
                  description="Construcción ágil de tu Producto Mínimo Viable para salir al mercado rápido."
                  priceTag="Sprint"
                  features={[
                    "Desarrollo No-Code/Low-Code",
                    "Validación técnica y comercial",
                    "Lanzamiento en semanas, no meses",
                    "Reducción drástica de riesgo financiero"
                  ]}
                />
              } />
              <Route path="/dashboard/kit-operacional" element={<OperationalKit />} />
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
              <Route path="/admin/fulfillment" element={<FulfillmentAdmin />} />
              <Route path="/admin/usuarios" element={<UsersAdmin />} />
              <Route path="/admin/sistema" element={<SystemAdmin />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
