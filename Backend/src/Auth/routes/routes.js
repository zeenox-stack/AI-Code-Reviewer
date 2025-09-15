require("dotenv").config();
const express = require("express");
const passport = require("../config/config"); 
const authMiddleware = require("../../Middlewares/middleware");

const router = express.Router();
const frontend =
  process.env.NODE_ENV === "prod"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user", "repo"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: frontend + "/auth/login",
  }),
  (req, res) => {
    res.redirect(
      "https://github.com/apps/gh-ai-code-reviewer-app/installations/new/"
    );
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(frontend + req.path); 
      return res.status(200).json({ success: "Logged out" });
    });
  });
});

module.exports = router;
