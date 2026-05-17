import { createClient } from '@supabase/supabase-js';

export interface BrainIdea {
  id: string;
  title: string;
  description: string | null;
  status: string;
  validation_score: number | null;
  recommendation: string | null;
  created_at: string;
}

export interface BrainProject {
  id: string;
  name: string;
  status: string;
  description: string | null;
  repo_url: string | null;
  deploy_url: string | null;
  created_at: string;
}

export interface BrainDecision {
  id: string;
  decision: string;
  reasoning: string | null;
  created_at: string;
  project_id: string | null;
}

export interface BrainAgentRun {
  id: string;
  agent_name: string;
  task_description: string | null;
  status: string;
  started_at: string;
  completed_at: string | null;
  project_id: string | null;
}

export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
