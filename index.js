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

app.listen(port, ()=>{
    console.log(`listening to ${port}`);
});

app.get("/", (req,res)=>{
    res.send("Hi, welcome to our homepage!");
});