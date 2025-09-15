require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

let cachedToken = null;
let tokenExpiry = 0;

module.exports = (async () => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  if (cachedToken && Date.now() < tokenExpiry) {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${cachedToken}` } }
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_EMAIL,
    password: process.env.SUPABASE_PASSWORD
  });

  if (error) throw new Error(`Supabase sign-in failed: ${error.message}`);

  cachedToken = data.session.access_token;
  tokenExpiry = Date.now() + data.session.expires_in * 1000;

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${cachedToken}` } }
  });
})();