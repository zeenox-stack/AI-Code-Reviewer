require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");

const authRoutes = require("./Auth/routes/routes");
const authMiddleware = require("./Middlewares/middleware");
const repoRoutes = require("./Repo/routes/routes");
const webHookRoutes = require("./Webook/routes/routes");
const handleGetProfile = require("./Profile/controller/controller");
const { handleImmediateReview } = require("./Webook/controller/controller");

const app = express();
const pool = new Pool({
  connectionString:
    process.env.SUPABASE_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  }, 
  family: 4,
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV !== "dev"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    store: new pgSession({
      pool,
    }),
    cookie: {
      secure: process.env.NODE_ENV !== "dev",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV !== "dev" ? "none" : "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.get("/check", authMiddleware, (req, res) =>
  res.status(200).json({ success: "Allowed" })
);

app.use("/repo", authMiddleware, repoRoutes);

app.use("/webhook", webHookRoutes); 

app.post("/review", authMiddleware, handleImmediateReview);

app.get("/profile", authMiddleware, handleGetProfile);

module.exports = app;
