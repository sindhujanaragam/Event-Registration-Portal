// studentRoutes.js
const express = require("express");
const router = express.Router();
const Student = require("../Models/Student");
const Event = require("../Models/Event");

// Student Login
router.post("/login", async (req, res) => {
    try {
        const { name, email, rollno } = req.body;

        // Check if student exists
        let student = await Student.findOne({ rollno });
        if (!student) {
            // If not, create new student
            student = new Student({ name, email, rollno, registeredEvents: [] });
            await student.save();
        }

        res.json(student);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Register for Event
router.post("/register", async (req, res) => {
    try {
        const { studentId, eventId, department } = req.body;

        const student = await Student.findById(studentId);
        const event = await Event.findById(eventId);

        if (!student || !event) {
            return res.status(404).json({ error: "Student or Event not found" });
        }

        // Prevent duplicate registration
        if (event.participants.includes(student._id)) {
            return res.status(400).json({ error: "Already registered" });
        }

        // Add student to event participants
        event.participants.push(student._id);
        await event.save();

        // Add event to student's registeredEvents
        student.registeredEvents.push(event._id);
        await student.save();

        res.json({ message: "Successfully registered" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Get all events (for student dashboard)
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find().populate({
            path: "participants",
            select: "name rollno"
        });

        res.json(events);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

module.exports = router;