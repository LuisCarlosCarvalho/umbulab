import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// IMPORTANTE: Para operações server-side (ex: inserir em tabela com RLS bypass), deve usar o SERVICE_ROLE_KEY.
// Se não tiver, usamos o ANON, mas a política precisa permitir (como fizemos no SQL).
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl!, supabaseKey!);
