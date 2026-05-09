const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Expert = require('../models/Expert');

const seedExperts = [
  {
    name: "Dr. Ananya Sharma",
    category: "Full Stack Development",
    experience: 10,
    rating: 4.9,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "10:00 AM", isBooked: false },
      { date: new Date('2026-05-12'), time: "11:30 AM", isBooked: false },
      { date: new Date('2026-05-13'), time: "02:00 PM", isBooked: false }
    ]
  },
  {
    name: "Rajesh Malhotra",
    category: "Data Science & AI",
    experience: 12,
    rating: 4.8,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "09:00 AM", isBooked: false },
      { date: new Date('2026-05-14'), time: "03:00 PM", isBooked: false }
    ]
  },
  {
    name: "Priyanka Verma",
    category: "UI/UX Design",
    experience: 7,
    rating: 4.7,
    availableSlots: [
      { date: new Date('2026-05-13'), time: "11:00 AM", isBooked: false },
      { date: new Date('2026-05-15'), time: "04:30 PM", isBooked: false }
    ]
  },
  {
    name: "Amitabh Gupta",
    category: "Cloud Computing",
    experience: 15,
    rating: 4.9,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "02:00 PM", isBooked: false },
      { date: new Date('2026-05-16'), time: "10:00 AM", isBooked: false }
    ]
  },
  {
    name: "Sneha Reddy",
    category: "Mobile App Development",
    experience: 6,
    rating: 4.6,
    availableSlots: [
      { date: new Date('2026-05-14'), time: "11:00 AM", isBooked: false },
      { date: new Date('2026-05-14'), time: "12:30 PM", isBooked: false }
    ]
  },
  {
    name: "Vikram Singh",
    category: "Cybersecurity",
    experience: 9,
    rating: 4.8,
    availableSlots: [
      { date: new Date('2026-05-13'), time: "09:30 AM", isBooked: false },
      { date: new Date('2026-05-15'), time: "02:30 PM", isBooked: false }
    ]
  },
  {
    name: "Kavita Iyer",
    category: "Blockchain Technology",
    experience: 5,
    rating: 4.7,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "03:00 PM", isBooked: false },
      { date: new Date('2026-05-13'), time: "10:30 AM", isBooked: false }
    ]
  },
  {
    name: "Sandeep Bansal",
    category: "Digital Marketing",
    experience: 11,
    rating: 4.5,
    availableSlots: [
      { date: new Date('2026-05-14'), time: "04:00 PM", isBooked: false },
      { date: new Date('2026-05-15'), time: "11:00 AM", isBooked: false }
    ]
  },
  {
    name: "Meera Deshmukh",
    category: "Product Management",
    experience: 13,
    rating: 4.9,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "11:00 AM", isBooked: false },
      { date: new Date('2026-05-16'), time: "03:00 PM", isBooked: false }
    ]
  },
  {
    name: "Arjun Rao",
    category: "DevOps Engineering",
    experience: 8,
    rating: 4.7,
    availableSlots: [
      { date: new Date('2026-05-13'), time: "12:00 PM", isBooked: false },
      { date: new Date('2026-05-14'), time: "09:00 AM", isBooked: false }
    ]
  },
  {
    name: "Nandini Joshi",
    category: "Quality Assurance",
    experience: 6,
    rating: 4.6,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "01:30 PM", isBooked: false },
      { date: new Date('2026-05-15'), time: "10:00 AM", isBooked: false }
    ]
  },
  {
    name: "Rohan Kulkarni",
    category: "Data Analytics",
    experience: 10,
    rating: 4.8,
    availableSlots: [
      { date: new Date('2026-05-13'), time: "03:30 PM", isBooked: false },
      { date: new Date('2026-05-14'), time: "11:30 AM", isBooked: false }
    ]
  },
  {
    name: "Sanjana Nair",
    category: "Machine Learning",
    experience: 7,
    rating: 4.9,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "09:30 AM", isBooked: false },
      { date: new Date('2026-05-15'), time: "02:00 PM", isBooked: false }
    ]
  },
  {
    name: "Aditya Hegde",
    category: "Game Development",
    experience: 9,
    rating: 4.7,
    availableSlots: [
      { date: new Date('2026-05-13'), time: "04:00 PM", isBooked: false },
      { date: new Date('2026-05-16'), time: "11:00 AM", isBooked: false }
    ]
  },
  {
    name: "Pooja Trivedi",
    category: "E-commerce Strategy",
    experience: 11,
    rating: 4.6,
    availableSlots: [
      { date: new Date('2026-05-14'), time: "10:30 AM", isBooked: false },
      { date: new Date('2026-05-15'), time: "01:00 PM", isBooked: false }
    ]
  },
  {
    name: "Varun Mehta",
    category: "Internet of Things (IoT)",
    experience: 8,
    rating: 4.7,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "12:00 PM", isBooked: false },
      { date: new Date('2026-05-13'), time: "09:00 AM", isBooked: false }
    ]
  },
  {
    name: "Ishita Saxena",
    category: "Big Data",
    experience: 10,
    rating: 4.8,
    availableSlots: [
      { date: new Date('2026-05-14'), time: "02:30 PM", isBooked: false },
      { date: new Date('2026-05-16'), time: "09:30 AM", isBooked: false }
    ]
  },
  {
    name: "Deepak Choudhury",
    category: "Database Administration",
    experience: 14,
    rating: 4.8,
    availableSlots: [
      { date: new Date('2026-05-13'), time: "11:00 AM", isBooked: false },
      { date: new Date('2026-05-15'), time: "03:30 PM", isBooked: false }
    ]
  },
  {
    name: "Shweta Pandey",
    category: "Business Analysis",
    experience: 9,
    rating: 4.7,
    availableSlots: [
      { date: new Date('2026-05-12'), time: "04:30 PM", isBooked: false },
      { date: new Date('2026-05-14'), time: "12:00 PM", isBooked: false }
    ]
  },
  {
    name: "Abhishek Bhatt",
    category: "Embedded Systems",
    experience: 12,
    rating: 4.9,
    availableSlots: [
      { date: new Date('2026-05-13'), time: "02:00 PM", isBooked: false },
      { date: new Date('2026-05-15'), time: "10:30 AM", isBooked: false }
    ]
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");
    await Expert.deleteMany({});
    await Expert.insertMany(seedExperts);
    console.log("✅ Database Seeded Successfully with 20 Indian Experts!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDB();
