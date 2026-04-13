import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertTriangle, ShieldCheck, UserCheck, Settings, Lock, CheckCircle2, TrendingUp, TrendingDown, Clock } from "lucide-react";

/**
 * CRM Vertical - "Más allá del Miedo"
 * Componente que mapea la realidad operativa en SLA, Riesgo y Unit Economics
 */
const OperationalKit = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'pipeline'>('radar');

  // Dummy Data - En fase 5 esto se abastecerá con data real relacional
  const slaClients = [
    { id: '1', name: 'Corpo Med', status: 'CRÍTICO', slaRisk: 88, daysLeft: 1, type: 'B2B Healthcare' },
    { id: '2', name: 'Alpha Logistics', status: 'STABLE', slaRisk: 15, daysLeft: 12, type: 'Supply Chain' },
    { id: '3', name: 'TechFlow SaaS', status: 'WARNING', slaRisk: 65, daysLeft: 3, type: 'Software' },
  ];

  const pipelineStages = [
    {
      id: 's1',
      title: 'Triage Algorítmico',
      count: 12,
      leads: [
        { id: 'l1', name: 'Omega Corp', score: 92, tag: 'Tier 1' },
        { id: 'l2', name: 'Dr. Santos', score: 45, tag: 'Disqualified' },
      ]
    },
    {
      id: 's2',
      title: 'Zero-Touch Setup',
      count: 3,
      leads: [
        { id: 'l3', name: 'Vertex Studios', status: 'provisioning' },
      ]
    },
    {
      id: 's3',
      title: 'Active Fulfillment',
      count: 8,
      leads: [
        { id: 'l4', name: 'Corpo Med', status: 'delayed', blocked: true },
        { id: 'l5', name: 'Vanguard Architects', status: 'on-track', blocked: false },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Zero-Trust Environment</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Kit Operacional / Vertical CRM</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Cabina de control quirúrgico. Mida LTV de sus clientes, aísle cuellos de botella de personal humano y garantice cero rupturas en sus Acuerdos de Nivel de Servicio (SLA).
          </p>
        </div>
        <div className="flex bg-secondary/50 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'radar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Radar SLA
          </button>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'pipeline' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Flujo Asíncrono
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDER: RADAR SLA */}
      {activeTab === 'radar' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background/40 backdrop-blur-sm border-white/5 shadow-inner">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Ratio LTV : CAC</p>
                    <p className="text-3xl font-bold text-foreground">4.2<span className="text-sm text-muted-foreground ml-1">x</span></p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-full">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
                  <span className="font-bold">+0.5x</span> vs Q anterior (Sano)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-sm border-red-500/20 shadow-inner">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Riesgo SLA (Global)</p>
                    <p className="text-3xl font-bold text-red-500">18<span className="text-sm text-red-500/70 ml-1">%</span></p>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-full animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                <p className="text-xs text-red-400 mt-4 flex items-center gap-1">
                  <span className="font-bold">1</span> Proyecto en peligro crítico
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-sm border-white/5 shadow-inner">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Human Capacity Limit</p>
                    <p className="text-3xl font-bold text-foreground">85<span className="text-sm text-muted-foreground ml-1">%</span></p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                  <span className="font-bold">Alerta:</span> Cuello de botella en Onboarding
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SLA Tracking List */}
          <Card className="border-white/5 bg-background/60 shadow-inner">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Auditoría de Acuerdos de Nivel de Servicio
              </CardTitle>
              <CardDescription>
                Identificación de Kill Factors operativos antes del impacto en el cliente final.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slaClients.map((client) => (
                  <div key={client.id} className={`p-4 rounded-lg border ${client.status === 'CRÍTICO' ? 'bg-red-500/5 border-red-500/20' : client.status === 'WARNING' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-secondary/20 border-white/5'} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-secondary/40`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{client.name}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">{client.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs mt-2">
                        <div className="flex-1 max-w-[200px]">
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Tensión Riesgo ({client.slaRisk}%)</span>
                          </div>
                          <Progress value={client.slaRisk} className={`h-1.5 ${client.status === 'CRÍTICO' ? 'bg-red-500/20 [&>div]:bg-red-500' : client.status === 'WARNING' ? 'bg-orange-500/20 [&>div]:bg-orange-500' : 'bg-emerald-500/20 [&>div]:bg-emerald-500'}`} />
                        </div>
                        <span className={`font-mono text-xs font-bold ${client.daysLeft <= 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {client.daysLeft} d restantes
                        </span>
                      </div>
                    </div>
                    <div>
                      {client.status === 'CRÍTICO' ? (
                        <Button size="sm" variant="destructive" className="w-full md:w-auto h-8 text-xs font-bold font-mono uppercase tracking-wide">
                          Mitigar Interrupción
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" className="w-full md:w-auto h-8 text-xs font-mono uppercase tracking-wide opacity-50 cursor-not-allowed">
                          Operando
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CONDITIONAL RENDER: PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start gap-4">
            <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="text-foreground font-medium text-sm">Flujo de Triaje Autoritativo</h3>
              <p className="text-muted-foreground text-xs mt-1">Este tablero visualiza el progreso asíncrono. Los clientes de baja cualidad se abortan antes del embudo. La dependencia humana es estrictamente delegada a la columna de "Active Fulfillment".</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className="bg-secondary/20 rounded-xl p-4 border border-white/5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{stage.title}</h3>
                  <Badge variant="secondary" className="font-mono">{stage.count}</Badge>
                </div>
                
                <div className="space-y-3 flex-1">
                  {stage.leads.map((lead) => (
                    <Card key={lead.id} className={`bg-background/80 shadow-md border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer`}>
                      {lead.blocked && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                      )}
                      <CardContent className="p-4">
                        <p className="font-medium text-sm text-foreground">{lead.name}</p>
                        
                        <div className="mt-3 flex gap-2">
                          {lead.score && (
                            <Badge variant="outline" className={`text-[10px] ${lead.score > 80 ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'}`}>
                              LLM-Score: {lead.score}
                            </Badge>
                          )}
                          {lead.tag && (
                            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">
                              {lead.tag}
                            </span>
                          )}
                          {lead.status === 'delayed' && (
                            <span className="text-[10px] uppercase tracking-wider text-red-500 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Fricción
                            </span>
                          )}
                          {lead.status === 'provisioning' && (
                            <span className="text-[10px] uppercase tracking-wider text-primary flex items-center gap-1">
                              <Settings className="w-3 h-3 animate-spin" /> Provisionando...
                            </span>
                          )}
                          {lead.status === 'on-track' && (
                            <span className="text-[10px] uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Resiliente
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default OperationalKit;
