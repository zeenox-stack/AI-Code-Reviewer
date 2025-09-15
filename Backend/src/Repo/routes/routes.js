const express = require("express");
const router = express.Router();

const {
  handleGetRepos,
  handleRepoCreation, 
  handleRepoUpdates
} = require("../controller/controller");

router.get("/get", handleGetRepos);

router.post("/create", handleRepoCreation);

router.post("/update", handleRepoUpdates);

module.exports = router;
