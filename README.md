# 🚀 DevlUp Labs Summer of Code

<div align="center">

<img src="public/screenshots/screenshot.png" alt="DevlUp Labs Summer of Code Terminal" width="80%">

### *Fostering open-source innovation through collaborative coding challenges!*

<p align="center">
  <a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
  </a>
  <a href="https://reactjs.org" target="_blank" rel="noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="react" width="40" height="40"/>
  </a>
  <a href="https://tailwindcss.com" target="_blank" rel="noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="tailwindcss" width="40" height="40"/>
  </a>
  <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="vite" width="40" height="40"/>
  </a>
</p>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/lakshyajain-0291/Devlup_SOC)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/lakshyajain-0291/Devlup_SOC/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=devlup-soc)](https://devlup-soc.vercel.app/)

[Live Demo](https://devlup-soc.vercel.app/) • [Features](#-features) • [Commands](#-terminal-commands) • [Installation](#-installation--setup) • [Contributing](#-contributing)

</div>

## 📋 Overview

A terminal-themed web application for the DevlUp Labs Summer of Code program that connects students with open-source projects. This interactive platform allows users to explore projects, learn about mentors, and apply to contribute using a unique terminal-like interface.

## ✨ Features

- **🖥️ Terminal Interface**: Navigate the application using command-line style interactions
- **📂 Project Exploration**: Browse, search, and filter available open source projects
- **👨‍🏫 Mentor Directory**: Access information about project mentors and their expertise
- **📝 Interactive Application**: Apply to projects directly through the interface
- **📊 Analytics Dashboard**: Track site usage with interactive visualizations
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices

## 💻 Terminal Commands

| Command | Description |
| ------- | ----------- |
| `help` | Display available commands |
| `clear` | Clear terminal history |
| `projects` | List all available projects |
| `search [query]` | Search for projects by keyword |
| `filter [tech]` | Filter projects by technology |
| `view [id]` | View details of a specific project |
| `mentors` | Show all project mentors |
| `stats` | Display site analytics summary |
| `stats --view analytics` | Open the full analytics dashboard |
| `stats --live` | Show real-time updating analytics in terminal |
| `apply` | Open the contributor application form |

## 📊 Analytics System

The site includes a comprehensive analytics system to track visitor engagement:

- **Visitor Tracking**: Automatically captures page views and unique visitors
- **Interactive Dashboard**: Visual representation of site traffic and popular pages
- **Time-Based Analysis**: View trends by hour, day, week, or month
- **Page Popularity**: Identify which projects and pages are most visited
- **Terminal Integration**: Access analytics directly through terminal commands
- **Google Sheets Backend**: All data is securely stored in a Google Sheet

## 🛠️ Tech Stack

<details>
<summary>Click to expand</summary>

- **Frontend**: 
  - React 18 with TypeScript
  - Tailwind CSS with custom terminal theme
  - Shadcn/UI for modern component design
  - Recharts for data visualization

- **Build & Development**: 
  - Vite for fast development experience
  - Bun for package management and scripting

- **Integration & Data**: 
  - Google Sheets API for project data
  - Google Apps Script for analytics data collection
  - React Hook Form with validation
  - Framer Motion for animations

- **Deployment**: 
  - Vercel for CI/CD and hosting
</details>

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lakshyajain-0291/devlup-soc.git
   cd devlup-soc
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or with Bun
   bun install
   ```

3. **Environment setup**
   - Copy `.env.example` to `.env.local`
   - Add your Google Sheets CSV URL:
     ```
     VITE_GOOGLE_SHEETS_CSV_URL=your_csv_url_here
     ```
   - Add your Analytics Script URL (for tracking):
     ```
     VITE_ANALYTICS_SCRIPT_URL=your_analytics_script_url_here
     ```

4. **Google Apps Script Setup**
   - Create a new Apps Script in your Google Sheet
   - Add the analytics handler script (see documentation)
   - Deploy as web app and copy the URL to your `.env.local`

5. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Build for production**
   ```bash
   npm run build
   # or
   bun run build
   ```

## 🤝 Contributing

Contributions are what make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [DevlUp Labs](https://devluplabs.tech/#/) for organizing the Summer of Code program
- All mentors who contribute their time to guide students
- [Shadcn/UI](https://ui.shadcn.com/) for the UI components
- [Lucide Icons](https://lucide.dev/) for beautiful icon set
- [Recharts](https://recharts.org/) for visualization components
- [Framer Motion](https://www.framer.com/motion/) for animations

---

<div align="center">
Made with ⚡ by DevlUp Labs Summer of Code Team
</div>
