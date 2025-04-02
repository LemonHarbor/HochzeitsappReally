// supabase/supabase.js
const { createClient } = require('@supabase/supabase-js');

// Supabase-Konfiguration
const supabaseUrl = 'https://cwuygosoynoitfrikdts.supabase.co';
const supabaseKey = 'XWeTCWRb5wQ6NMDMPW43h6YL+PLRpg78rDxfZMpMrZQothSTvYP+/BjG8hR6ZpO4EWae9fhsjOstZ1srzEH1PA==';

// Supabase-Client erstellen
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
