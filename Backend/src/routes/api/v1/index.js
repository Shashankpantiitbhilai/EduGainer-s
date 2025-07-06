const express = require("express");

// Import all existing routes with updated paths
const authRoutes = require("./auth");
const generalRoutes = require("./route");
const adminRoutes = require("./admin");
const classesRoutes = require("./classes");
const libraryRoutes = require("./Library");
const adminLibraryRoutes = require("./admin_lib");
const adminEventRoutes = require("./admin_event");
const adminClassesRoutes = require("./admin_classes");
const adminTeamRoutes = require("./admin/Manage-Teams");
const geminiRoutes = require("./gemini");
const eventLogsRoutes = require("./eventLogs");
const visionRoutes = require("./vision");
const translationRoutes = require("./translation");
const chatRoutes = require("./chat");
const trafficRoutes = require("./traffic");
const ecommerceRoutes = require("./ecommerce");

const router = express.Router();

module.exports = (io) => {
  // Mount all routes with their original paths
  router.use("/", generalRoutes);
  router.use("/auth", authRoutes);
  router.use("/admin", adminRoutes);
  router.use("/classes", classesRoutes);
  router.use("/library", libraryRoutes);
  router.use("/admin_library", adminLibraryRoutes);
  router.use("/admin_event", adminEventRoutes);
  router.use("/admin_classes", adminClassesRoutes);
  router.use("/gemini", geminiRoutes);
  router.use("/db-events", eventLogsRoutes);
  router.use("/admin/team", adminTeamRoutes);
  router.use("/vision", visionRoutes);
  router.use("/translate", translationRoutes);
  router.use("/traffic", trafficRoutes);
  router.use("/ecommerce", ecommerceRoutes);
  
  // Chat routes need special handling for socket.io
  router.use("/chat", chatRoutes(io));
  
  return router;
};
