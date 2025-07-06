const express = require("express");
const v1Routes = require("./v1");

const router = express.Router();

module.exports = (io) => {
  // Mount v1 routes directly without version prefix
  router.use("/", v1Routes(io));
  
  return router;
};
