# Portfolio Website with Admin Console
<div align="center">
  <pre>
    _____           _    __      _ _       
   |  __ \         | |  / _|    | (_)      
   | |__) |__  _ __| |_| |_ ___ | |_  ___  
   |  ___/ _ \| '__| __|  _/ _ \| | |/ _ \ 
   | |  | (_) | |  | |_| || (_) | | | (_) |
   |_|   \___/|_|   \__|_| \___/|_|_|\___/ 
  </pre>
</div>

 
Welcome to my **portfolio website**! This site showcases my skills, experience, education, projects, and how to get in touch with me. It's built with **React** and **Vite** for a fast, modern web experience. 

**NEW FEATURE:** This portfolio now includes a powerful **Backend & Admin Console** that allows you to manage all content dynamically through a user-friendly dashboard. No coding required to update your portfolio content!

---

## ✨ Key Features

### Frontend (Public Site)
- **Hero Section**: Dynamic introduction with skills showcase
- **Skills**: Categorized technical skills with icons
- **Experience**: Professional journey and work history
- **Education**: Academic background and certifications
- **Projects**: Showcase of completed and upcoming projects
- **Contact**: Easy way to get in touch

### Backend & Admin Console
- **Secure Admin Login**: JWT-based authentication
- **Dashboard Overview**: View all your portfolio statistics at a glance
- **Content Management**:
  - 🗂️ **Projects Manager**: Add, edit, delete projects with images
  - 👤 **Hero Editor**: Update name, title, description, and skills
  - 💼 **Skills Editor**: Manage skill categories and individual skills
  - 📋 **Experience Editor**: Add/edit work experience entries
  - 🎓 **Education Editor**: Manage education history
  - ⚙️ **Settings**: Site-wide configuration (coming soon mode, site title)
- **MongoDB Integration**: All data stored persistently in MongoDB
- **File Upload Support**: Upload project images directly through the admin

---

## Demo

<a href="https://ibb.co/99RJkdp2"><img src="https://i.ibb.co/svLhdXgQ/2.png" alt="2" border="0"></a>

---

## Live Preview

Check out the live preview of the portfolio website here:  
[**Live Demo**](https://YOUR_DOMAIN.vercel.app/)

**Admin Console:**  
Access the admin dashboard at: [**/admin**](https://YOUR_DOMAIN.vercel.app/admin)  
*(Login required - contact the developer for access)*

---
```
portfolio/
├── samuelportfolio/              # Main React Application
│   ├── src/
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   │   ├── index.css
│   │   │   │   └── tomorrow.css
│   │   │   └── images/
│   │   ├── components/
│   │   │   ├── ui/               # Reusable UI Components
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── EducationLoader.jsx
│   │   │   │   ├── evervault-card.jsx
│   │   │   │   ├── flip-words.jsx
│   │   │   │   ├── icon-cloud.jsx
│   │   │   │   ├── meteors.jsx
│   │   │   │   ├── sparkles-text.jsx
│   │   │   │   └── tooltip.jsx
│   │   │   └── *.jsx             # Main Components
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── About/
│   │   │   ├── Contact/
│   │   │   ├── Education/
│   │   │   ├── Experience/
│   │   │   ├── Header/
│   │   │   ├── Hero/
│   │   │   ├── Projects/
│   │   │   ├── Skills/
│   │   │   └── admin/            # Admin Console Pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Login.jsx
│   │   │       ├── Overview.jsx
│   │   │       ├── ProjectsManager.jsx
│   │   │       ├── HeroEditor.jsx
│   │   │       ├── SkillsEditor.jsx
│   │   │       ├── ExperienceEditor.jsx
│   │   │       ├── EducationEditor.jsx
│   │   │       └── Settings.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── server/                   # Backend API Server
│   │   ├── index.js              # Express server with all API routes
│   │   ├── uploads/              # File uploads directory
│   │   ├── SETUP.md
│   │   ├── render.yaml
│   │   └── package.json
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── *.config.js
├── package.json                  # Root package.json
├── package-lock.json
└── README.md
```
---

## Sections of the Portfolio

The portfolio website consists of the following sections:

- **Home**: Introduction and a brief overview.
- **Skills**: A detailed list of my technical skills.
- **Experience**: My professional journey and work experience.
- **Education**: Academic background and certifications.
- **Projects**: A showcase of the projects I've worked on.
- **Contact**: Information on how to reach out to me.

---

## 💻 Technologies Used

### Frontend
- **Framework:** React.js with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Routing:** React Router
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Password Hashing:** Bcrypt.js

---

## Installation ⬇️

You will need to download **Git** and **Node** to run this project.

### Git
- Verify the installation:
  ```bash
  git --version
  ```

### Node

- Download and install Node.js from the official website: [Node.js Downloads](https://nodejs.org/)
- Make sure you have the latest version of both Git and Node on your computer.
- Verify the installation:
  ```bash
  node --version
  ```

# Getting Started 🎯

### Fork and Clone the Repository 🚀
1. Click the **Fork** button at the top-right corner of the page to create your own copy of the repository.
2. After forking, open your terminal and run the following commands to clone the repo:

  ```bash
  git clone https://github.com/devigsam/portfolio.git
  ```
Navigate to the Project Directory 📂
Once the repository is cloned, change your directory to the project folder:
```bash
cd portfolio
```

Install Dependencies ⚙️
From the root directory of your project, install the necessary packages:
```bash
npm install
```

Run the Development Server 🚀
Start the development server to see your project live:
```bash
npm run dev
```


## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

### 🤝 Custom Portfolio Websites - Let's Work Together!

Looking for a **custom portfolio website** tailored to your unique style and needs? You've come to the right place!

I specialize in building **bespoke portfolio websites** that showcase your skills, projects, and experience in a way that stands out. Whether you need:

- 🎨 A **unique design** that matches your personal brand
- ⚡ A **high-performance** site with modern animations
- 📱 A **fully responsive** layout for all devices
- 🔧 A **customizable admin console** to manage your content easily
- 🛠️ Specific features tailored to your industry

...I can build it for you!

### Why Work With Me?

- ✅ **Modern Tech Stack**: React, Vite, Tailwind CSS, and more
- ✅ **Clean, Maintainable Code**: Easy to extend and modify
- ✅ **Fast & SEO-Friendly**: Optimized for speed and search engines
- ✅ **Admin Dashboard**: Manage your content without coding
- ✅ **Ongoing Support**: I'm here to help even after launch

---

### 📬 Get In Touch

Ready to create your dream portfolio website? **Contact me today** and let's discuss your project!

📧 **Email**: YOUR_EMAIL@yourdomain.com  
🌐 **Website**: [YOUR_DOMAIN.vercel.app](https://YOUR_DOMAIN.vercel.app)

Let's turn your vision into reality! 🚀

---

<div align="center"> Made with ❤️ by Samuel Ndubuisi </div>

