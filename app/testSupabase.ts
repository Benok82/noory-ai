import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('waitlist').select('*').limit(1);
  if (error) {
    console.error('Supabase Fehler:', error);
  } else {
    console.log('Supabase Verbindung OK, erste Zeile der Tabelle waitlist:', data);
  }
}

test();