-- =============================================================================
-- SEMILLA DE CASOS DE ÉXITO: GOLDEN LOOPS (BLOQUE CERO)
-- Estos registros crean URLs públicas demostrativas de Alta Conversión.
-- Rutas: /b/demo-psicologia /b/demo-agencia /b/demo-saas
-- =============================================================================

-- Habilitar extensión si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ 
DECLARE
  psicologia_lead_id UUID := uuid_generate_v4();
  agencia_lead_id UUID := uuid_generate_v4();
  saas_lead_id UUID := uuid_generate_v4();
BEGIN

  -- 1. LIMPIAR VERSIONES PREVIAS SI EXISTEN (Idempotencia)
  DELETE FROM public.business_blueprints WHERE public_id IN ('demo-psicologia', 'demo-agencia', 'demo-saas');

  -- -------------------------------------------------------------------------
  -- CASO 1: PSICOLOGÍA CLÍNICA / COACHING TRANSFORMACIONAL
  -- -------------------------------------------------------------------------
  
  -- Insert Lead Base
  INSERT INTO public.leads (id, name, email, whatsapp, status, score, diagnostic_answers)
  VALUES (
    psicologia_lead_id, 
    'Paciente Demo 1',
    'demo1@bloquecero.com', 
    '5550000001', 
    'new',
    85,
    '{"business_name": "Clínica Renacer: Trascendencia del Trauma", "idea_description": "Terapia psicológica 1 a 1 cobrada por hora. Los pacientes abandonan al sentirse un poco mejor, no completan la transformación profunda.", "target_audience": "Personas con trauma complejo", "core_problem": "Falta de adherencia al tratamiento", "monetization": "Cobro por sesión", "marketing": "Boca a boca", "tech_stack": "Agenda física y WhatsApp"}'::jsonb
  );

  -- Insert Blueprint
  INSERT INTO public.business_blueprints (
    public_id, source_lead_id, lifecycle_stage, delivery_progress, 
    intake_payload, metadata
  )
  VALUES (
    'demo-psicologia', psicologia_lead_id, 'delivered', 7,
    '{"real_problem": "Modelo de cobro que incentiva el abandono precoz", "value_prop": "Programa de 12 semanas para alquimia del dolor", "unit_economics": "High ticket ($2,500 USD por programa en lugar de $50 USD por hora)", "anti_segment": "Personas que solo buscan validación, no transformación."}'::jsonb,
    jsonb_build_object(
      'preliminary', 'La dependencia del cobro por hora está erosionando tu energía clínica y la transformación del paciente.',
      'markdown', '# El Imperio Lógico: Clínica Renacer

> *El trauma no superado es la prisión del potencial humano. Tu modelo actual de "cobro por hora" no solo es un error financiero, es una falla ética: le permite al paciente huir cuando el trabajo profundo recién comienza.*

## 1. Patología Operativa y Foso Defensivo (Moat)
Tu cuello de botella no es la falta de pacientes, es **la estructura comercial del sufrimiento**.
- **Problema Raíz:** Vendes tiempo, no resultados. El paciente asiste 3 sesiones, siente alivio temporal y abandona. No hay transformación, solo sedación.
- **Arma Desproporcionada (Unfair Advantage):** Tu metodología clínica cruzada con un **Programa de Alto Compromiso**. Cuando blindas el proceso (pago anticipado de 12 semanas), obligas al paciente a cruzar el fuego. 

## 2. Ingeniería de Rentabilidad (Unit Economics)
Tienes que abandonar la trinchera del terapeuta que sobrevive sesión a sesión:
- **Modelo Antiguo:** $50 USD/hora. Riesgo de cancelación altísimo. LTV (Valor de por vida): $300 USD.
- **Nuevo Modelo Operativo:** Programa Transformacional "Alquimia del Dolor": $2,500 USD (Pago inicial). 
- **Matriz de Ganancia:** Tu facturación aumenta 800% por cliente, atendiendo a **menos pacientes con un compromiso absoluto**.

## 3. Exclusión Estratégica (Anti-Segmento)
Para escalar sin volverte loco, el filtro de entrada debe ser despiadado:
- **Rechaza:** Pacientes buscando "ser escuchados" sin disposición a hacer trabajo profundo.
- **Acepta:** Individuos cuya oscuridad personal amenaza su estructura vital (ejecutivos, emprendedores, líderes) y que valoran el tiempo por encima del capital.

### Próximo Paso
El modelo es viable, pero la arquitectura de adquisición está rota. Requiere implementación inmediata del **Bloque 03 (MVP de Validación)** para estructurar el funnel de agendamiento y el checkout del programa High-Ticket.'
    )
  );

  -- -------------------------------------------------------------------------
  -- CASO 2: AGENCIA DE MARKETING / GROWTH B2B
  -- -------------------------------------------------------------------------
  
  INSERT INTO public.leads (id, name, email, whatsapp, status, score, diagnostic_answers)
  VALUES (
    agencia_lead_id, 
    'Fundador Agencia Demo',
    'demo2@bloquecero.com', 
    '5550000002', 
    'new',
    65,
    '{"business_name": "Nexus Growth Ops", "idea_description": "Agencia digital ofreciendo de todo (Pauta, Redes, Web). El margen es mínimo y los clientes exigen como si fuéramos sus socios.", "target_audience": "Cualquier Pyme con presupuesto", "monetization": "Retainer mensual bajo"}'::jsonb
  );

  INSERT INTO public.business_blueprints (
    public_id, source_lead_id, lifecycle_stage, delivery_progress, 
    intake_payload, metadata
  )
  VALUES (
    'demo-agencia', agencia_lead_id, 'delivered', 7,
    '{"real_problem": "Generalización extrema. Cero estandarización del fulfillment.", "value_prop": "Sistemas de Adquisición B2B para Consultoras Financieras"}'::jsonb,
    jsonb_build_object(
      'preliminary', 'La generalización te condena a competir por precio. Operas como una fábrica de tareas, no como un socio de crecimiento.',
      'markdown', '# El Imperio Lógico: Nexus Growth Ops

> *Ser una agencia "full-service" es la ruta garantizada hacia el agotamiento. Estás absorbiendo el caos operativo de tus clientes por márgenes ridículos.*

## 1. Patología Operativa y Foso Defensivo (Moat)
- **Problema Raíz:** El síndrome del restaurante con 100 menús. Cada cliente requiere un diseño operativo distinto, lo que destruye tu rentabilidad.
- **Arma Desproporcionada:** Micro-Nicho verticalizado. El mozo de todos no domina nada. Pasa de "Agencia 360" a "Generador de Pipeline B2B exclusivo para Consultoras Financieras".

## 2. Ingeniería de Rentabilidad (Unit Economics)
- **Modelo Antiguo:** Retainers de $500 USD/mes haciendo de community manager y pautador. (CAC altísimo, Margen Neto < 15%).
- **Nuevo Modelo Operativo:** Implementación de Infraestructura + Comisión por Lead Calificado. Setup de $3,000 USD + $1,500/mes base. Margen operativo proyectado superior al 70% estandarizando procesos en n8n.

## 3. Puntos de Ruptura
Si multiplicas tu demanda actual x10, tu equipo (y tú) colapsarían en 48 horas. El "fulfillment" manual es el veneno. Tienes que desacoplar tu tiempo de la entrega del servicio automatizando la extracción de reportes y la gestión del canal con IA.'
    )
  );

  -- -------------------------------------------------------------------------
  -- CASO 3: SAAS B2B / SOFTWARE VERTICAL
  -- -------------------------------------------------------------------------
  
  INSERT INTO public.leads (id, name, email, whatsapp, status, score, diagnostic_answers)
  VALUES (
    saas_lead_id, 
    'SaaS Founders Demo',
    'demo3@bloquecero.com', 
    '5550000003', 
    'new',
    78,
    '{"business_name": "Vectra: ERP para Ferreterías", "idea_description": "Software en la nube para inventario. Los clientes no entienden cómo usarlo y la rotación (churn) es del 30% en los primeros meses.", "monetization": "Suscripción 30 USD/mes"}'::jsonb
  );

  INSERT INTO public.business_blueprints (
    public_id, source_lead_id, lifecycle_stage, delivery_progress, 
    intake_payload, metadata
  )
  VALUES (
    'demo-saas', saas_lead_id, 'delivered', 7,
    '{"real_problem": "Complejidad técnica del usuario superando la interfaz", "anti_segment": "Ferreterías de dueño único sin operador decicado."}'::jsonb,
    jsonb_build_object(
      'preliminary', 'Tu software no falla por código, falla por adopción. Estás vendiendo tecnología a dueños que valoran el control manual.',
      'markdown', '# El Imperio Lógico: Vectra (SaaS)

> *Desarrollaste un Ferrari, pero se lo vendes a personas que no saben conducir y no les gusta la gasolina. Tu métrica de Churn es un síntoma de un error catastrófico de fricción en la adopción (Activation).*

## 1. Patología Operativa
- **Problema Raíz:** El *Time-To-Value* (TTV) es demasiado largo. El dueño de la ferretería abandona el software al tercer día porque migrar 5,000 SKUs manualmente es una tortura.
- **La Solución:** Elimina la fricción de entrada. El onboarding no puede ser "hazlo tú mismo", debe ser "Automático vía OCR y carga gestionada". Tu servicio no es el software, es **la limpieza de su inventario inicial**.

## 2. Ingeniería de Rentabilidad
- **El Peligro del Low-Ticket:** A $30 USD mensuales, tienes un LTV de $90 USD (por el churn del 30%). Tu CAC (Costo de Adquisición) debe ser nulo para sobrevivir, lo cual es matemáticamente inviable en B2B local.
- **Reestructuración:** Incrementa el precio a $149 USD/mes pero incluye un scanner físico en comodato. Aumentas la utilidad percibida, reduces el Churn al <3% (por lock-in físico y migración completada).

## 3. Ecosistema de Adquisición
Abandona la pauta digital genérica y Facebook Ads. Tu cliente no compra software por Instagram. Tu estrategia de "Content-Led Growth" requiere alianzas directas con las Asociaciones de Distribuidores Ferreteros. Un solo canal, dominado con autoridad absoluta.'
    )
  );

END $$;
