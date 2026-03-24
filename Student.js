const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    rollno: String,
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
});

module.exports = mongoose.model("Student", studentSchema);