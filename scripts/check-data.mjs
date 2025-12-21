import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pcuvomojzlwmtkyyhihn.supabase.co',
  'sb_secret_fjAoaPAS9coi4JSW8qFhgg_E0kTwWF0'
);

async function check() {
  // 检查总数
  const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  console.log('Jobs 总数:', count);

  // 检查前3条
  const { data, error } = await supabase.from('jobs').select('*').limit(3);
  if (error) {
    console.log('错误:', error);
  } else {
    console.log('前3条数据:');
    console.log(JSON.stringify(data, null, 2));
  }
}

check();
