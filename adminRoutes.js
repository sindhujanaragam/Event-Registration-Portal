// routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const Event = require("../Models/Event");
const Student = require("../Models/Student");




router.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Admin credentials
    if (username === "admin" && password === "admin123") {

        res.json({
            message: "Admin login successful"
        });

    } else {

        res.status(401).json({
            message: "Invalid credentials"
        });

    }

});





router.post("/addEvent", async (req, res) => {

    try {

        const { name, date, venue, description } = req.body;

        const newEvent = new Event({
            name,
            date,
            venue,
            description,
            participants: []
        });

        await newEvent.save();

        res.json({
            message: "Event added successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error adding event"
        });

    }

});



router.get("/events", async (req, res) => {

    try {

        const events = await Event.find()
            .populate({
                path: "participants",
                select: "name rollno"
            });

        res.json(events);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching events"
        });

    }

});



router.delete("/deleteEvent/:id", async (req, res) => {

    try {

        await Event.findByIdAndDelete(req.params.id);

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error deleting event"
        });

    }

});



router.put("/updateEvent/:id", async (req, res) => {

    try {

        const { name, date, venue, description } = req.body;

        await Event.findByIdAndUpdate(
            req.params.id,
            {
                name,
                date,
                venue,
                description
            }
        );

        res.json({
            message: "Event updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error updating event"
        });

    }

});


router.get("/studentsCount", async (req, res) => {

    try {

        const count = await Student.countDocuments();

        res.json({
            totalStudents: count
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error counting students"
        });

    }

});


module.exports = router;
