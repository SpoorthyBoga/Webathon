
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const moment = require("moment");

const app = express();
const port = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
async function main() {
  const studentDB = mongoose.createConnection("mongodb://127.0.0.1:27017/User");
  const eventDB = mongoose.createConnection("mongodb://127.0.0.1:27017/event");

  const Event = eventDB.model("Event", require("./models/Event").schema);
  const Student = studentDB.model("Student", require("./models/student").schema);
  const Faculty = studentDB.model("Faculty", require("./models/faculty").schema);
  const Management = studentDB.model("Management", require("./models/management").schema);
  const Organiser = studentDB.model("Organiser", require("./models/organiser").schema);
  const Certificate = eventDB.model("Certificate", require("./models/Certificate").schema);

  global.EventModel = Event;
  global.StudentModel = Student;
  global.FacultyModel=Faculty;
  global.ManagementModel=Management;
  global.OrganiserModel=Organiser;

  console.log("✅ All databases connected!");
}
main().catch((err) => console.error(err));

// Routes
app.get('/login', (req,res)=>res.render("login.ejs"))
app.post("/login", async (req, res) => {
  const { email, password, dashboard } = req.body;

  if (!dashboard) {
    return res.status(400).send("Please select a dashboard.");
  }

  let user;
  let redirectPath = "/login";

  try {
    switch (dashboard) {
      case "Student":
        user = await global.StudentModel.findOne({ email });
        if (user) redirectPath = `/s_dashboard/${user.email}`;
        break;
      case "Faculty":
        user = await global.FacultyModel.findOne({ email });
        if (user) redirectPath = `/f_dashboard/${user.email}`;
        break;
      case "Organizer":
        user = await global.OrganiserModel.findOne({ email });
        if (user) redirectPath = `/e_dashboard/${user.email}`;
        break;
      case "Management":
        user = await global.ManagementModel.findOne({ email });
        if (user) redirectPath = `/m_dashboard/${user.email}`;
        break;
      default:
        return res.status(400).send("Invalid dashboard selected.");
    }

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.password !== password) {
      return res.status(401).send("Wrong password!");
    }

    return res.redirect(redirectPath);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Internal Server Error");
  }
});


// Reusable event dashboard logic
async function renderEventDashboard1(req, res, viewName) {
  try {

    const allEvents = await global.EventModel.find();
    const today = moment().startOf("day");

    const ongoingEvents = [];
    const upcomingEvents = [];

    allEvents.forEach((event) => {
      const parsedDate = moment(event.date, [
        "YYYY-MM-DD",
        "YYYY/MM/DD",
        "DD-MM-YYYY",
        "MM-DD-YYYY",
        "MMMM D, YYYY",
        "MMM D, YYYY",
        "D MMMM YYYY",
      ], true);

      if (!parsedDate.isValid()) return;

      if (parsedDate.isSame(today, "day")) ongoingEvents.push(event);
      else if (parsedDate.isAfter(today, "day")) upcomingEvents.push(event);
    });

    res.render(viewName, { ongoingEvents, upcomingEvents });
  } catch (err) {
    console.error(`🚨 Error rendering ${viewName}:`, err);
    res.status(500).send("Error loading events");
  }
}


async function renderEventDashboard(req, res, viewName) {
  try {
    const email = req.params.email;

    const student = await global.StudentModel.findOne({ email }); // Fetch user by email
    if (!student) return res.status(404).send("User not found");

    const allEvents = await global.EventModel.find();
    const today = moment().startOf("day");

    const ongoingEvents = [];
    const upcomingEvents = [];

    allEvents.forEach((event) => {
      const parsedDate = moment(event.date, [
        "YYYY-MM-DD",
        "YYYY/MM/DD",
        "DD-MM-YYYY",
        "MM-DD-YYYY",
        "MMMM D, YYYY",
        "MMM D, YYYY",
        "D MMMM YYYY",
      ], true);

      if (!parsedDate.isValid()) return;

      if (parsedDate.isSame(today, "day")) ongoingEvents.push(event);
      else if (parsedDate.isAfter(today, "day")) upcomingEvents.push(event);
    });

    // 👇 Pass `user` along with events
    res.render(viewName, { user: student, ongoingEvents, upcomingEvents });

  } catch (err) {
    console.error(`🚨 Error rendering ${viewName}:`, err);
    res.status(500).send("Error loading events");
  }
}



app.get("/landing", (req, res) => renderEventDashboard1(req, res, "landing.ejs"));
app.get("/s_dashboard/:email", (req, res) => renderEventDashboard(req, res, "s_dashboard.ejs"));
app.get("/f_dashboard/:email", (req, res) => renderEventDashboard1(req, res, "f_dashboard.ejs"));
app.get("/e_dashboard/:email", (req, res) => renderEventDashboard1(req, res, "e_dashboard.ejs"));
app.get("/m_dashboard/:email", (req, res) => renderEventDashboard1( req, res,"m_dashboard.ejs"));
app.get("/events", (req, res) => renderEventDashboard1(req, res, "events.ejs"));
app.get("/e_dashboard", (req, res) =>renderEventDashboard1(req, res, "e_dashboard.ejs"));

// Event description
app.get("/description/:id", async (req, res) => {
  try {
    const event = await global.EventModel.findById(req.params.id);
    if (!event) return res.status(404).send("Event not found");
    res.render("description.ejs", { event });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Static render routes
app.get("/register", (req, res) => res.render("registration.ejs"));
app.get("/pendingapprovals", (req, res) => res.render("pendingapproval.ejs"));
app.get("/approvalstatus", (req, res) => res.render("approvalstatus.ejs"));
app.get("/new_event", (req, res) => res.render("new_event.ejs"));

app.post("/events/new", async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      category,
      amount,
      capacity,
      coordinatorName,
      coordinatorPhone
    } = req.body;

    // Optional coordinator handling
    const coordinators = (coordinatorName || []).map((name, i) => ({
      name,
      phone: coordinatorPhone[i] || ""
    }));

    const newEvent = new global.EventModel({
      title,
      description,
      date,
      time,
      venue,
      category,
      amount,
      capacity,
      createdBy: req.user ? req.user._id : null, // Replace this logic as needed
      approved: false,
      // images: [], // you can add image upload handling later
      // coordinators: coordinators, // only if schema supports it
    });

    await newEvent.save();
    res.redirect("/e_dashboard");
  } catch (err) {
    console.error("Error saving event:", err);
    res.status(500).send("Something went wrong.");
  }
});

app.get('/events', async (req, res) => {
  const { keyword, category, venue, date } = req.query;

  const filter = {};

  if (venue) filter.venue = new RegExp(venue, 'i');
  if (date) filter.date = { $gte: new Date(date) };

  try {
    const events = await Event.find(filter);

    const currentDate = new Date();
    const ongoingEvents = events.filter(event => new Date(event.date) <= currentDate);
    const upcomingEvents = events.filter(event => new Date(event.date) > currentDate);

    res.render('events', {
      ongoingEvents,
      upcomingEvents
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching events");
  }
});

app.get("/profile/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const student = await global.StudentModel.findOne({ email });

    if (!student) return res.status(404).send("Student not found");

    res.render("profile.ejs", { student });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/about', (req,res)=>res.render("about.ejs"))


app.get('/registered/:email', async (req, res) => {
  const { email } = req.params;
  const student = await global.StudentModel.findOne({ email }).populate({
    path: 'registeredEvents',
    model: global.EventModel
  });
  if (!student) {
    return res.status(404).send("Student not found");
  }
  res.render('registered.ejs', { user: student });
  
});

// app.get('/register/:id/:email', async (req, res) => {
//   try {
//       const event = await Event.findById(req.params.eventId);
//       if (!event) {
//           return res.status(404).send('Event not found');
//       }

//       // Assuming the user is logged in and you have the student data
//       const student = req.user; // Replace with your actual logic to get the logged-in user

//       res.render('registration', { student, event }); // Rendering the EJS form
//   } catch (error) {
//       console.error('Error fetching event:', error);
//       res.status(500).send('Internal Server Error');
//   }
// });

app.get('/register/:id/:email', async (req, res) => {
  const eventId = req.params.id;
  const email = req.params.email;
  const student = await global.StudentModel.findOne({ email });
  const studentId = student.id; // Replace with session ID in real case

  try {
    const event = await global.EventModel.findById(eventId);
    const student = await global.StudentModel.findById(studentId);

    if (!event || !student) {
      return res.status(404).send("Event or student not found");
    }

    res.render("registration.ejs", { event, student });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// app.post('/register/:eventId', async (req, res) => {
//   try {
//       const { studentName, studentEmail, studentRollNumber, phone, amount, eventId } = req.body;

//       // Find the student by email or roll number
//       const student = await User.findOne({ email: studentEmail });
//       if (!student) {
//           return res.status(400).json({ success: false, message: 'Student not found' });
//       }

//       // Find the event by eventId
//       const event = await Event.findById(eventId);
//       if (!event) {
//           return res.status(400).json({ success: false, message: 'Event not found' });
//       }

//       // Check if the student is already registered for the event
//       if (student.registeredEvents.includes(eventId)) {
//           return res.status(400).json({ success: false, message: 'You are already registered for this event' });
//       }

//       // Register the student by pushing eventId into their registeredEvents
//       student.registeredEvents.push(eventId);
//       await student.save();

//       // Optionally, store phone number if needed
//       student.phone = phone;
//       await student.save();

//       // Send a success response
//       res.redirect(`/thank-you`);  // Redirect to a thank-you page after successful registration
//   } catch (error) {
//       console.error('Error during registration:', error);
//       res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
//   }
// });

app.get('/register/:id', (req,res)=>{
  res.send("You can not register for this event!")
})

app.get('/calendar', (req,res)=>res.render("calendar.ejs"))

// Route to get certificates for a specific student by email or studentId
// Import the Certificate model // Adjust path to the correct model
// global.CertificateModel = eventDB.model("Certificate", require("./models/Certificate").schema);
app.get('/certificates', async (req, res) => {
 res.render("certificates.ejs");
});

app.get('/venue', (req,res)=>res.render("venue.ejs"));
app.get('/attendance', (req,res)=>res.render("attendance.ejs"));

app.get('/studentattendance', (req,res) => res.render("studentattendance.ejs"));

// Start server
app.listen(port, () => console.log(`✅ Server listening on port ${port}`));
