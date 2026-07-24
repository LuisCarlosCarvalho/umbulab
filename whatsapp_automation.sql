-- Tabela de Follow-ups do WhatsApp
CREATE TABLE IF NOT EXISTS lead_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES aprovacoes_usuario(id) ON DELETE CASCADE,
  phone text NOT NULL,
  step text NOT NULL CHECK (step IN ('1h', '24h')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
  scheduled_for timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
-- Apenas admins ou a service_role podem gerir os follow-ups
CREATE POLICY "Admins podem ver todos os follow-ups" 
  ON lead_followups FOR SELECT 
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins podem inserir follow-ups" 
  ON lead_followups FOR INSERT 
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins podem atualizar follow-ups" 
  ON lead_followups FOR UPDATE 
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Opcional: Permitir inserção anon se as leads forem criadas via API sem autenticação
-- Mas como estamos a usar o Supabase Admin Client nas nossas rotas da API, a Service Role 
-- irá ignorar o RLS de qualquer forma, por isso não é estritamente necessário.

-- Criar Índices de Performance
CREATE INDEX IF NOT EXISTS idx_lead_followups_lead_id ON lead_followups(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_followups_status ON lead_followups(status);
CREATE INDEX IF NOT EXISTS idx_lead_followups_scheduled_for ON lead_followups(scheduled_for);
