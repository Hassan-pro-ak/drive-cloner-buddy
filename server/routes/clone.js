const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const createClient = require("../config/google");

// Dummy clone route
router.post("/", async (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: "No link provided" });
  }

  // Normally: use Google Drive API to copy file/folder
  return res.json({
    message: "Cloning done (dummy)",
    source: link,
    status: "success"
  });
});

module.exports = router;
