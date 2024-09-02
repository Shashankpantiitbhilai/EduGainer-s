const express = require("express");

const upload = require("../multer");
const router = express.Router();

const admin_event = require("../controllers/Event/admin_event");

const legend = require("../controllers/library/color")

router.post("/addEvent", admin_event.addEvent)
router.patch("/editEvent/:id", admin_event.editEvent)
router.delete("/deleteEvent/:id", admin_event.deleteEvent)
router.get("/getAllEvents", admin_event.getEvents)

module.exports = router;
