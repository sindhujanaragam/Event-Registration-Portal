const API = "http://localhost:5000/api";

// Student login
async function login() {
    const nameVal = document.getElementById("name").value;
    const emailVal = document.getElementById("email").value;
    const rollVal = document.getElementById("rollno").value;

    const res = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            rollno: rollVal
        })
    });

    const data = await res.json();

  
    localStorage.setItem("studentId", data._id);
    localStorage.setItem("name", nameVal);
    localStorage.setItem("email", emailVal);
    localStorage.setItem("rollno", rollVal);

    window.location.href = "Dashboard.html";
}
// Load events
async function loadEvents() {
    const res = await fetch(`${API}/students/events`);
    const events = await res.json();

    let html = "";
    events.forEach(e => {
        html += `
        <div class="event-card">
        <h3>${e.name}</h3>
        <p>${e.date} | ${e.venue}</p>
        <p>${e.description}</p>
        <button onclick="goRegister('${e._id}')">Register</button>
        </div>
        `;
    });

    document.getElementById("events").innerHTML = html;
}

function goRegister(id){
    localStorage.setItem("eventId", id);
    window.location = "register.html";
}

// Register event
async function registerEvent() {
    const dept = document.getElementById("dept").value;

    if (!dept) {
        alert("Please enter department ❗");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/students/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentId: localStorage.getItem("studentId"),
                eventId: localStorage.getItem("eventId"),
                department: dept
            })
        });

        const data = await res.json();
        console.log(data);

        document.getElementById("msg").innerText = "✅ Successfully Registered!";
        document.getElementById("msg").style.color = "green";

        setTimeout(() => {
            window.location.href = "Dashboard.html";
        }, 1500);

    } catch (err) {
        console.log(err);
        document.getElementById("msg").innerText = "❌ Registration Failed";
        document.getElementById("msg").style.color = "red";
    }
}

// Admin login
async function adminLogin() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(
        "http://localhost:5000/api/admin/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await res.json();

    if (res.ok) {

        alert("Login Successful");

        window.location.href = "admin_dashboard.html";

    } else {

        alert(data.message);

    }
}

// Add event
async function addEvent() {

    const name = document.getElementById("ename").value;
    const date = document.getElementById("date").value;
    const venue = document.getElementById("venue").value;
    const desc = document.getElementById("desc").value;

    console.log(name, date, venue, desc); // 🔍 debug

    try {
        const res = await fetch("http://localhost:5000/api/admin/addEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                date: date,
                venue: venue,
                description: desc
            })
        });

        const data = await res.json();
        console.log(data); 

        alert("Event Added Successfully ");

        loadAdminEvents();

    } catch (err) {
        console.log(err);
        alert("Error adding event ");
    }
}

// Load admin events
async function loadAdminEvents() {
    const res = await fetch("http://localhost:5000/api/admin/events");
    const events = await res.json();

    let html = "";

    events.forEach(e => {
        html += `
        <div class="event-card">
            <h3>${e.name}</h3>
            <p>${e.date} | ${e.venue}</p>

            <p>👥 Registered: ${e.participants.length}</p>

            <button onclick='showEventDetails(${JSON.stringify(e)})'>
                View Details 
            </button>

            <button onclick="deleteEvent('${e._id}')">Delete</button>
        </div>
        `;
    });

    document.getElementById("adminEvents").innerHTML = html;
}
// Delete event
async function deleteEvent(id){
    await fetch(`${API}/admin/delete/${id}`, {method:"DELETE"});
    loadAdminEvents();
}

function adminPage(){
    window.location="admin.html";
}
async function getStudentCount() {
    const res = await fetch("http://localhost:5000/api/admin/studentsCount");
    const data = await res.json();

    document.getElementById("count").innerText = "Total Students: " + data.count;
}
function showEventDetails(event) {
    let html = `
        <h3>${event.name}</h3>
        <p>📅 ${event.date}</p>
        <p>📍 ${event.venue}</p>
        <h4>👥 Total Students Registered: ${event.participants.length}</h4>
    `;

    if (event.participants.length === 0) {
        html += "<p>No students registered yet </p>";
    } else {
        html += `
        <table border="1" style="width:100%; margin-top:15px; border-collapse: collapse;">
            <tr style="background:#ffd6e8;">
                <th>S.No</th>
                <th>Name</th>
                <th>Roll No</th>
            </tr>
        `;

        event.participants.forEach((s, index) => {
            html += `
            <tr>
                <td>${index + 1}</td>
                <td>${s.name}</td>
                <td>${s.rollno}</td>
            </tr>
            `;
        });

        html += "</table>";
    }

    document.getElementById("eventDetails").innerHTML = html;
}