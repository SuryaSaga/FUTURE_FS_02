# Future CRM - Client Lead Management System

A high-performance, premium Mini CRM built for agencies and startups to track and manage client leads.

## ✨ Features

- **Lead Dashboard**: View all incoming leads in a clean, modern interface.
- **Status Tracking**: Update leads from `New` → `Contacted` → `Converted`.
- **Follow-up Notes**: Add and store detailed notes for every interaction.
- **Analytics**: Key metrics (Total Leads, New, Conversions) summarized at a glance.
- **Secure Admin Panel**: Protected access for authorized users only.
- **Premium Design**: Dark mode, glassmorphism, and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, Axios, React Router.
- **Backend**: Node.js, Express, JWT Authentication.
- **Database**: MongoDB (Mongoose).

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- MongoDB running locally (default: `mongodb://localhost:27017/minicrm`).

### Quick Start (Integrated)

1. Install all dependencies and seed the database:
   ```bash
   npm run install-all
   npm run seed
   ```
2. Start both backend and frontend:
   ```bash
   npm start
   ```

### Manual Setup (Alternative)

#### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Run the seed script to create a default admin and dummy leads:
   ```bash
   node seed.js
   ```
   *Default Admin: `admin` / `password123`*
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Usage

- Log in with `admin` / `password123`.
- Click on any lead card to add notes.
- Use the dropdown on lead cards to change status.
- Search leads using the top search bar.
