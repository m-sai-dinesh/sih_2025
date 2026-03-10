import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Education from '../models/Education.js';
import Hazard from '../models/Hazard.js';
import Dashboard from '../models/Dashboard.js';
import Contact from '../models/Contact.js';
import Video from '../models/Video.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Education.deleteMany({});
    await Hazard.deleteMany({});
    await Dashboard.deleteMany({});
    await Contact.deleteMany({});
    await Video.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed Users
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    await User.insertMany(hashedUsers);
    console.log('👥 Users seeded');

    // Seed Education
    const educationData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/education.json'), 'utf8'));
    const educationEntries = [];
    
    Object.keys(educationData).forEach(language => {
      Object.keys(educationData[language]).forEach(disasterType => {
        educationEntries.push({
          language,
          disasterType,
          content: educationData[language][disasterType]
        });
      });
    });
    
    await Education.insertMany(educationEntries);
    console.log('📚 Education content seeded');

    // Seed Hazards
    const hazardsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/hazards.json'), 'utf8'));
    const hazardEntries = Object.keys(hazardsData).map(state => ({
      state,
      hazards: hazardsData[state]
    }));
    await Hazard.insertMany(hazardEntries);
    console.log('⚠️  Hazards seeded');

    // Seed Dashboard
    const dashboardData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dashboard.json'), 'utf8'));
    await Dashboard.create(dashboardData);
    console.log('📊 Dashboard data seeded');

    // Seed Contacts
    const contactsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/contacts.json'), 'utf8'));
    await Contact.insertMany(contactsData);
    console.log('📞 Contacts seeded');

    // Seed Videos
    const videosData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/videos.json'), 'utf8'));
    await Video.insertMany(videosData);
    console.log('🎥 Videos seeded');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
