const express = require("express");
const router = express.Router();
const createClient = require("../config/google");
const { google } = require("googleapis");

// Dummy storage
let userTokens = {};

router.get("/login", (req, res) => {
  const oauth2Client = createClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive"],
  });
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code;
  const oauth2Client = createClient();
  const { tokens } = await oauth2Client.getToken(code);
  userTokens["default"] = tokens; // store dummy
  res.json({ message: "Login successful!", tokens });
});

router.get("/logout", (req, res) => {
  userTokens = {};
  res.json({ message: "Logged out" });
});

module.exports = router;
