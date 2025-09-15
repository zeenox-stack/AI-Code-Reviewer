require("dotenv").config(); 

const passport = require("passport"); 
const GithubStrategy = require("passport-github2").Strategy;  
const getSupabase = require("../../Database/utils/getSupabase");

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID, 
    clientSecret: process.env.GITHUB_CLIENT_SECRET, 
    callbackURL: (process.env.NODE_ENV !== "dev" ? process.env.BACKEND_URL : "http://localhost:3000") + "/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
try {
    const supabase = await getSupabase();
    let { data: user, error } = await supabase.from("users").select("*").eq("github_id", profile.id).single();
    if (error && error.code !== "PGRST116") throw error;

    if (!user) {
        const { data: inserted, error: insertError } = await supabase.from("users").insert({
            github_id: profile.id, 
            username: profile.username, 
            avatar_url: profile.photos[0].value, 
            email: profile.emails ? profile.emails[0].value : null
        }).select().single();

        if (insertError) throw insertError; 

        user = inserted;
    };

    return done(null, user)
} catch (err) {
    console.error(err); 
    return done(err, null);
}
}))

passport.serializeUser((user, done) => {
     done(null, user.id)
}); 

passport.deserializeUser(async (id, done) => {
try {
    const supabase = await getSupabase();
    const { data: user, error } = await supabase.from("users").select("*").eq("id", id).single(); 
    
    if (error) throw error; 

    done(null, user);
} catch (err) {
    console.error(err); 
    done(err, null);
}
}); 

module.exports = passport;