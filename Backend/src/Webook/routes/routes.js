const express = require("express");
const router = express.Router();

const { handleEvents } = require("../controller/controller");

router.post("/gitHub", handleEvents);

module.exports = router;
