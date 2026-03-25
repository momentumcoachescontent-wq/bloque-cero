import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghbdarbyompzhwnqrxjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYmRhcmJ5b21wemh3bnFyeGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTcxMjAsImV4cCI6MjA4OTUzMzEyMH0.ioR_knb3DEDHXsLZcwY574dJr2HwT-0AkvFTnXIC8iU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('1. Autenticando usuario de prueba...');
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: `test_debugger_${Date.now()}@momentum.local`,
    password: 'Password123!',
    options: {
      data: { full_name: 'Debugger Bot' }
    }
  });

  if (authErr) {
    if (authErr.message.includes('rate_limit') || authErr.message.includes('User already registered')) {
      console.log('Fallo auth normal (rate limit), intentando login anónimo...');
      const { data: anonData, error: anonErr } = await supabase.auth.signInAnonymously();
      if (anonErr) return console.error('Tampoco anónimo:', anonErr);
    } else {
      return console.error('Error Auth:', authErr);
    }
  }

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return console.log('No user');

  console.log('Usuario:', user.user.id);

  console.log('2. Insertando Lead de prueba...');
  const { data: leadData, error: leadErr } = await supabase.from('leads').insert({
    email: user.user.email || 'anon@test.com',
    full_name: 'Debugger Bot',
    business_name: 'Test Corp',
    business_size: '1-10',
    current_challenge: 'Testing trigger recursion',
    monthly_revenue: '0',
    primary_goal: 'Test'
  }).select().single();

  if (leadErr) return console.error('Error Lead:', leadErr);
  
  console.log('Lead creado:', leadData.id);

  console.log('3. Disparando POST a blueprint_requests...');
  const timeStart = Date.now();
  const { data: bpData, error: bpErr } = await supabase.from('blueprint_requests').insert({
    user_id: user.user.id,
    lead_id: leadData.id,
    diagnostic_answers: { target: "test_value" }
  }).select().single();

  console.log(`Tiempo: ${Date.now() - timeStart}ms`);

  if (bpErr) {
    console.error('BINGO! Error capturado:');
    console.error(JSON.stringify(bpErr, null, 2));
  } else {
    console.log('Éxito brutal:', bpData);
  }
}

runTest();
