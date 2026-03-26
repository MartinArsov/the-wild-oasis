import { createClient } from '@supabase/supabase-js';
export const supabaseUrl = 'https://cffpgrsohtbbezvcqehx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZnBncnNvaHRiYmV6dmNxZWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjM5MzAsImV4cCI6MjA4NjIzOTkzMH0.ozsqdfjlk83JwBs2jwWdgzy8uekQUvylnbVE5iA129s';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
