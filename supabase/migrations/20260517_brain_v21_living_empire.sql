-- Brain v2.1 Living Empire — new tables
-- Applied: 2026-05-17
-- Project: dlbnjiomldlijbshxysh

CREATE TABLE IF NOT EXISTS public.brain_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('request','response','broadcast','alert')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  subject TEXT,
  body TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','received','processed','failed')),
  correlation_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_brain_messages_to_agent ON public.brain_messages(to_agent, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_brain_messages_correlation ON public.brain_messages(correlation_id) WHERE correlation_id IS NOT NULL;
ALTER TABLE public.brain_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brain_heartbeat (
  agent_name TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'alive' CHECK (status IN ('alive','working','sleeping','error','dead')),
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_task TEXT,
  token_used_today INTEGER NOT NULL DEFAULT 0,
  next_scheduled_run TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_brain_heartbeat_status ON public.brain_heartbeat(status, last_heartbeat DESC);
ALTER TABLE public.brain_heartbeat ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brain_token_budget (
  agent_name TEXT PRIMARY KEY,
  model TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  daily_budget INTEGER NOT NULL DEFAULT 50000,
  used_today INTEGER NOT NULL DEFAULT 0,
  last_reset DATE NOT NULL DEFAULT CURRENT_DATE,
  alert_threshold INTEGER NOT NULL DEFAULT 80,
  total_used_lifetime BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brain_token_budget ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brain_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('L1','L2','L3','L4')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  channel TEXT NOT NULL DEFAULT 'dashboard' CHECK (channel IN ('dashboard','email','telegram','sms')),
  title TEXT NOT NULL,
  body TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending','sent','failed','suppressed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_brain_notifications_unread ON public.brain_notifications(level, created_at DESC) WHERE read_at IS NULL;
ALTER TABLE public.brain_notifications ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brain_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  units_used INTEGER NOT NULL DEFAULT 1,
  endpoint TEXT,
  status_code INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_brain_api_usage_service ON public.brain_api_usage(service, created_at DESC);
ALTER TABLE public.brain_api_usage ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.telegram_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL,
  message_id BIGINT,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_telegram_conv_user_time ON public.telegram_conversations(user_id, created_at DESC);
ALTER TABLE public.telegram_conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.brain_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 10),
  category TEXT,
  source TEXT,
  market_size_estimate TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','investigating','validated','rejected','converted')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_brain_opportunities_score ON public.brain_opportunities(score DESC, created_at DESC) WHERE status = 'new';
ALTER TABLE public.brain_opportunities ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.crypto_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy TEXT NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY','SELL','HOLD','CLOSE')),
  timeframe TEXT,
  entry_price NUMERIC,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  metadata JSONB DEFAULT '{}'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crypto_signals ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.crypto_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES public.crypto_signals(id) ON DELETE SET NULL,
  exchange TEXT NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY','SELL')),
  mode TEXT NOT NULL DEFAULT 'paper' CHECK (mode IN ('paper','live')),
  entry_price NUMERIC,
  exit_price NUMERIC,
  quantity NUMERIC,
  pnl NUMERIC,
  fees NUMERIC,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','cancelled')),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);
ALTER TABLE public.crypto_trades ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.crypto_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange TEXT NOT NULL,
  asset TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'paper' CHECK (mode IN ('paper','live')),
  usd_value NUMERIC,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crypto_portfolio_latest ON public.crypto_portfolio(exchange, asset, snapshot_at DESC);
ALTER TABLE public.crypto_portfolio ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.crypto_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  strategy TEXT,
  mode TEXT NOT NULL DEFAULT 'paper' CHECK (mode IN ('paper','live')),
  trades_total INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_pnl NUMERIC DEFAULT 0,
  max_drawdown NUMERIC DEFAULT 0,
  win_rate NUMERIC,
  profit_factor NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_crypto_metrics_date_strat_mode ON public.crypto_metrics(metric_date, strategy, mode);
ALTER TABLE public.crypto_metrics ENABLE ROW LEVEL SECURITY;

-- Service role policies (full access for backend)
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'brain_messages','brain_heartbeat','brain_token_budget',
    'brain_notifications','brain_api_usage','telegram_conversations',
    'brain_opportunities','crypto_signals','crypto_trades',
    'crypto_portfolio','crypto_metrics'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS service_role_all ON public.%I;', t);
    EXECUTE format('CREATE POLICY service_role_all ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;
