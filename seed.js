const mongoose = require("mongoose");
const Venue = require("./models/Venue");

mongoose.connect("mongodb://127.0.0.1:27017/event")
  .then(() => {
    console.log("MongoDB connected for venue seeding");
    return seedVenues();
  })
  .catch(err => console.error("Connection error:", err));

async function seedVenues() {
  const venues = [
    {
      name: "Main Auditorium",
      location: "Block A",
      available: false,
      bookedSlots: [
        { date: new Date("2025-04-10"), time: "10:00 AM" },
        { date: new Date("2025-04-12"), time: "2:00 PM" }
      ]
    },
    {
      name: "Conference Hall 1",
      location: "Block B",
      available: true,
      bookedSlots: []
    },
    {
      name: "Seminar Room",
      location: "Library Building",
      available: false,
      bookedSlots: [
        { date: new Date("2025-04-15"), time: "11:30 AM" }
      ]
    },
    {
      name: "Sports Arena",
      location: "Back Gate",
      available: true,
      bookedSlots: []
    },
    {
      name: "Cultural Hall",
      location: "Block C",
      available: true,
      bookedSlots: []
    },
    {
      name: "Tech Hub Room",
      location: "Innovation Center",
      available: false,
      bookedSlots: [
        { date: new Date("2025-04-11"), time: "3:00 PM" }
      ]
    },
    {
      name: "Classroom 204",
      location: "Block D, 2nd Floor",
      available: true,
      bookedSlots: []
    },
    {
      name: "Mini Auditorium",
      location: "Block E",
      available: false,
      bookedSlots: [
        { date: new Date("2025-04-14"), time: "9:00 AM" },
        { date: new Date("2025-04-14"), time: "1:00 PM" }
      ]
    }
  ];

  await Venue.insertMany(venues);
  console.log("Venue data seeded successfully!");
  mongoose.connection.close();
}
