import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_JWT_SECRET_HERE';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'YOUR_MONGODB_URI_HERE')
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Auto-create admin if not exists
    const adminExists = await Admin.countDocuments();
    if (adminExists === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('YOUR_ADMIN_PASSWORD', salt);
      await Admin.create({ 
        email: 'YOUR_ADMIN_EMAIL@yourdomain.com', 
        password: hashedPassword 
      });
      console.log('Admin account created!');
    }
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// ==================== MODELS ====================

// Admin Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Admin = mongoose.model('Admin', adminSchema);

// Project Model
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tagline: String,
  src: String,
  link: String,
  color: { type: String, default: '#8f89ff' },
  githubLink: String,
  liveLink: String,
  isComingSoon: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});
const Project = mongoose.model('Project', projectSchema);

// Hero Model
const heroSchema = new mongoose.Schema({
  name: { type: String, default: 'Samuel Ndubuisi' },
  title: { type: String, default: 'Blockchain Developer & Software Enthusiast' },
  description: { type: String, default: 'Python & AI lover | Creative Dev 🔧 | Turning ideas into actionable and notable real world assets. 💻✨' },
  welcomeText: { type: String, default: 'WELCOME TO MY WORLD' },
  skills: [String],
  codeSnippet: String
});
const Hero = mongoose.model('Hero', heroSchema);

// Skills Model
const skillCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: String,
  color: String,
  skills: [{
    name: String,
    icon: String
  }],
  order: { type: Number, default: 0 }
});
const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);

// Experience Model
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  period: String,
  description: String,
  icon: String,
  order: { type: Number, default: 0 }
});
const Experience = mongoose.model('Experience', experienceSchema);

// Education Model
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  school: String,
  year: String,
  achievements: [String],
  skills: [String],
  description: String,
  mascot: String,
  order: { type: Number, default: 0 }
});
const Education = mongoose.model('Education', educationSchema);

// Settings Model
const settingsSchema = new mongoose.Schema({
  isComingSoonMode: { type: Boolean, default: false },
  siteTitle: { type: String, default: 'Samuel Ndubuisi - Portfolio' },
  maintenanceMessage: String
});
const Settings = mongoose.model('Settings', settingsSchema);

// ==================== MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, email: admin.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register (First admin only)
app.post('/api/admin/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Admin created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if admin exists
app.get('/api/admin/check', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.json({ exists: adminCount > 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PROJECT ROUTES ====================

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/projects', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tagline, link, color, githubLink, liveLink, isComingSoon, order } = req.body;
    const project = new Project({
      title,
      description,
      tagline,
      src: req.file ? `/uploads/${req.file.filename}` : '',
      link,
      color,
      githubLink,
      liveLink,
      isComingSoon: isComingSoon === 'true',
      order: order || 0
    });
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/projects/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tagline, link, color, githubLink, liveLink, isComingSoon, order } = req.body;
    const updateData = { title, description, tagline, link, color, githubLink, liveLink, isComingSoon: isComingSoon === 'true', order };
    
    if (req.file) {
      updateData.src = `/uploads/${req.file.filename}`;
    }
    
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== HERO ROUTES ====================

app.get('/api/hero', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/hero', authenticateToken, async (req, res) => {
  try {
    const { name, title, description, welcomeText, skills, codeSnippet } = req.body;
    let hero = await Hero.findOne();
    
    if (hero) {
      hero = await Hero.findByIdAndUpdate(hero._id, 
        { name, title, description, welcomeText, skills, codeSnippet }, 
        { new: true }
      );
    } else {
      hero = await Hero.create({ name, title, description, welcomeText, skills, codeSnippet });
    }
    
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SKILLS ROUTES ====================

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await SkillCategory.find().sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/skills', authenticateToken, async (req, res) => {
  try {
    const { title, icon, color, skills, order } = req.body;
    const skillCategory = new SkillCategory({ title, icon, color, skills, order });
    await skillCategory.save();
    res.json(skillCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/skills/:id', authenticateToken, async (req, res) => {
  try {
    const { title, icon, color, skills, order } = req.body;
    const skillCategory = await SkillCategory.findByIdAndUpdate(
      req.params.id,
      { title, icon, color, skills, order },
      { new: true }
    );
    res.json(skillCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/skills/:id', authenticateToken, async (req, res) => {
  try {
    await SkillCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== EXPERIENCE ROUTES ====================

app.get('/api/experience', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/experience', authenticateToken, async (req, res) => {
  try {
    const { title, company, period, description, icon, order } = req.body;
    const experience = new Experience({ title, company, period, description, icon, order });
    await experience.save();
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/experience/:id', authenticateToken, async (req, res) => {
  try {
    const { title, company, period, description, icon, order } = req.body;
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { title, company, period, description, icon, order },
      { new: true }
    );
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/experience/:id', authenticateToken, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== EDUCATION ROUTES ====================

app.get('/api/education', async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/education', authenticateToken, async (req, res) => {
  try {
    const { degree, school, year, achievements, skills, description, mascot, order } = req.body;
    const edu = new Education({ degree, school, year, achievements, skills, description, mascot, order });
    await edu.save();
    res.json(edu);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/education/:id', authenticateToken, async (req, res) => {
  try {
    const { degree, school, year, achievements, skills, description, mascot, order } = req.body;
    const edu = await Education.findByIdAndUpdate(
      req.params.id,
      { degree, school, year, achievements, skills, description, mascot, order },
      { new: true }
    );
    res.json(edu);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/education/:id', authenticateToken, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SETTINGS ROUTES ====================

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { isComingSoonMode, siteTitle, maintenanceMessage } = req.body;
    let settings = await Settings.findOne();
    
    if (settings) {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { isComingSoonMode, siteTitle, maintenanceMessage },
        { new: true }
      );
    } else {
      settings = await Settings.create({ isComingSoonMode, siteTitle, maintenanceMessage });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SEED ROUTES (For initial setup) ====================

app.post('/api/seed', async (req, res) => {
  try {
    // Seed default data if database is empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: "A Fully Operational Website for a Cleaning Service",
          description: "Sparkly Cleaning is a cleaning service in Ottawa Canada, and this is their website done by me. Using wordpress as a backend this fully operational website can be reused anywhere anytime, let me know if you need something like this.",
          tagline: "A wordpress website designed and ready for commercial cleaning services.",
          src: "2.png",
          link: "https://i.ibb.co/Kpz1g5dy/Sparkly.png",
          color: "#8f89ff",
          githubLink: "https://github.com/devbigsam",
          liveLink: "https://sparklycleaning.ca",
          isComingSoon: false,
          order: 0
        },
        {
          title: "A Simple Facial Recognition System",
          description: "This is a simple facial recognition system built with Python, OpenCV, and LBPH (Local Binary Patterns Histograms) for face recognition.",
          tagline: "Still Cooking, when i am done, i will publish a frontend for testing purposes.",
          src: "2.png",
          link: "https://i.ibb.co/h1f2zxdz/BFD.png",
          color: "#8f89ff",
          githubLink: "https://github.com/devbigsam/FACIAL-RECOGNITION",
          liveLink: "https://devbigsam.vercel.app",
          isComingSoon: false,
          order: 1
        },
        {
          title: "EVE AI — Multi-Model AI Copilot for Developers",
          description: "EVE AI is a fast, low-cost AI coding copilot and unified API that routes requests across OpenAI (Codex/GPT), Claude, and Gemini, with a VS Code extension for in-editor coding assistance and a single OpenAI-compatible endpoint for apps and tools.",
          tagline: "One API. Every AI. Built for speed.",
          src: "4.png",
          link: "https://i.ibb.co/CKbyqWcB/4.png",
          color: "#ed649e",
          githubLink: "https://github.com/devbigsam/",
          liveLink: "#",
          isComingSoon: true,
          order: 2
        },
        {
          title: "HYDRA-5 Intelligence System",
          description: "HYDRA-5 is an intelligence-first crypto prediction engine that combines real-time multi-source scraping with intentional confirmation delays and five complementary AI models.",
          tagline: "Multi-Source Intelligence + Five-Model Crypto Prediction System.",
          src: "HYDRA.jpeg",
          link: "https://i.ibb.co/9HNQcWXw/HYDRA.jpg",
          color: "#ed649e",
          githubLink: "https://github.com/devbigsam",
          liveLink: "https://devbigsam.vercel.app",
          isComingSoon: true,
          order: 3
        },
        {
          title: "A sleek portfolio built with React and Tailwind CSS",
          description: "A sleek portfolio built with React and Tailwind CSS to showcase your skills, projects, and experience in a modern design.",
          src: "2.png",
          link: "https://i.ibb.co/0jy3Z5R3/2.png",
          color: "#8f89ff",
          githubLink: "https://github.com/devbigsam/portfolio",
          liveLink: "https://devbigsam.vercel.app",
          isComingSoon: false,
          order: 4
        }
      ]);
    }

    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      await Hero.create({
        name: 'Samuel Ndubuisi',
        title: 'Blockchain Developer & Software Enthusiast',
        description: "Python & AI lover | Creative Dev 🔧 | Turning ideas into actionable and notable real world assets. 💻✨",
        welcomeText: 'WELCOME TO MY WORLD',
        skills: ['Python', 'Rust', 'React', 'UI/UX', '3D Modeling & Animations', 'MySQL', 'Whatsapp Bots', 'Meta API', 'Portfolio Management', 'TypeScript', 'Problem Solving', 'Proofreader', 'Anchor', 'Solidity', 'Linux', 'Discord Development', 'Telegram & Discord Bot Development']
      });
    }

    const skillCount = await SkillCategory.countDocuments();
    if (skillCount === 0) {
      await SkillCategory.insertMany([
        { title: 'Frontend Development', icon: 'Code2', color: 'text-blue-400', skills: [{ name: 'React', icon: 'FaReact' }, { name: 'Next.js', icon: 'SiNextdotjs' }, { name: 'TypeScript', icon: 'SiTypescript' }, { name: 'Tailwind CSS', icon: 'SiTailwindcss' }], order: 0 },
        { title: 'Backend Development', icon: 'Database', color: 'text-green-400', skills: [{ name: 'Node.js', icon: 'FaNodeJs' }, { name: 'Python', icon: 'FaPython' }, { name: 'PostgreSQL', icon: 'SiPostgresql' }, { name: 'MongoDB', icon: 'SiMongodb' }], order: 1 },
        { title: 'Blockchain Development', icon: 'Boxes', color: 'text-orange-400', skills: [{ name: 'Rust', icon: 'SiRust' }, { name: 'Anchor', icon: 'SiSolana' }, { name: 'Solidity', icon: 'SiEthereum' }, { name: 'Solana', icon: 'SiSolana' }], order: 2 },
        { title: 'Tools & Technologies', icon: 'Cpu', color: 'text-pink-400', skills: [{ name: 'VS Code', icon: 'TbBrandVscode' }, { name: 'Github', icon: 'SiGithub' }, { name: 'Vercel', icon: 'SiVercel' }, { name: 'Linux', icon: 'FaLinux' }], order: 3 }
      ]);
    }

    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany([
        { title: 'Project Developer & Management', company: 'Freelance', period: '2023 - Present', description: 'Managed end-to-end project development, coordinating execution, timelines, and deliverables to achieve consistent results.', icon: 'Briefcase', order: 0 },
        { title: 'WordPress Developer', company: 'Wordpress', period: '2016 - 2020', description: 'Started as a blogger, and with my skills in HTML and CSS, I started customizing my own themes, giving users of my website a unique view.', icon: 'Network', order: 1 },
        { title: 'Blockchain Developer', company: 'Solana - Ethereum - BSC', period: '2020 - Present', description: 'Developed smart contracts and decentralized applications across Solana, Ethereum, and BSC, focusing on secure, scalable real-world blockchain utilities.', icon: 'Boxes', order: 2 }
      ]);
    }

    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      await Education.insertMany([
        { degree: 'Secondary School Certificate (SSC)', school: 'Bedrock College', year: '2014-2020', achievements: ['GPA: 4.89', 'Subject: Science'], skills: ['Mathematics', 'Physics', 'Chemistry'], description: 'Focused on core science subjects with emphasis on practical laboratory work.', mascot: '📘', order: 0 },
        { degree: 'Bachelor of Computer Science (Bsc)', school: 'Coal City University', year: '2020-2024', achievements: ['GPA: Second Class Honours (Upper Division)'], skills: ['Data Analysis', 'IOT', 'Statistical Computing'], description: 'Strengthened analytical and problem-solving mindset through core computer science training.', mascot: '🎓', order: 1 }
      ]);
    }

    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Seed error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

