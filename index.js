const express=require("express");
const app=express();
const path= require("path");
const mongoose = require("mongoose");
const port=8080;
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://spoorthy0410:Cherry%40123@cluster0.rvd1sej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.set("view engine", "ejs" );
app.set("views",path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const eventsData = {
    ongoingEvents: [
      { title: 'Hackathon 2025', date: 'April 6', time: '9:00 AM', venue: 'Hall A' },
      { title: 'ML Bootcamp', date: 'April 7', time: '1:00 PM', venue: 'Room 201' }
    ],
    upcomingEvents: [
      { title: 'Cybersecurity 101', date: 'April 15', time: '11:00 AM', venue: 'Auditorium' },
      { title: 'Design Thinking', date: 'April 18', time: '3:00 PM', venue: 'Lab 3' }
    ]
  };


  const studentDashboardData = {
    registeredEvents: [
      { title: 'Hackathon 2025' },
      { title: 'Design Thinking' }
    ],
    attendedEvents: [
      { title: 'Webinar on AI' }
    ],
    certificates: [
      { name: 'Intro to AI' }
    ],
    badges: [
      { title: 'Tech Champ' }
    ],

    ongoingEvents: [
      { title: 'Hackathon 2025', date: 'April 6', time: '9:00 AM', venue: 'Hall A' },
      { title: 'ML Bootcamp', date: 'April 7', time: '1:00 PM', venue: 'Room 201' }
    ],
    upcomingEvents: [
      { title: 'Cybersecurity 101', date: 'April 15', time: '11:00 AM', venue: 'Auditorium' },
      { title: 'Design Thinking', date: 'April 18', time: '3:00 PM', venue: 'Lab 3' }
    ]
  };
  

app.listen(port, ()=>{
    console.log(`listening to ${port}`);
});

app.get("/", (req,res)=>{
    res.render("landing.ejs")
});

app.get("/login", (req,res)=>{
    res.render("login.ejs")
})


app.post("/login", (req, res) => {
    const { email, password, dashboard } = req.body;

    // TODO: Authenticate user (e.g., check MongoDB for email/password)
    // For now, we'll just simulate successful login

    if (!dashboard) {
        return res.status(400).send("Please select a dashboard.");
    }

    // Redirect based on dashboard selection
    switch (dashboard) {
        case "s_dashboard":
            return res.redirect("/s_dashboard");
        case "f_dashboard":
            return res.redirect("/f_dashboard");
        case "e_dashboard":
            return res.redirect("/e_dashboard");
        case "m_dashboard":
            return res.redirect("/m_dashboard");
        default:
            return res.status(400).send("Unknown dashboard type!");
    }
});

    


// app.get("/f_dashboard", (req,res)=>{
//     res.render("f_dashboard.ejs")
// })

app.get("/e_dashboard", (req,res)=>{
    res.render("e_dashboard.ejs")
})

app.get("/m_dashboard", (req,res)=>{
    res.render("m_dashboard.ejs")
})

app.get('/s_dashboard', (req, res) => res.render("f_dashboard.ejs", studentDashboardData));
app.get('/f_dashboard', (req, res) => res.render('f_dashboard', studentDashboardData));

app.get('/events', (req, res) => res.render('events', eventsData));
// app.get("/signup", (req, res)=>{
//     res.render("signup.ejs")
// })



