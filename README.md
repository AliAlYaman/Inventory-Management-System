# Advanced AI Inventory Management System

A feature-rich, modern inventory management system built with React, Vite, and TypeScript, supercharged with a suite of powerful AI capabilities from OpenAI.

**[➡️ View Live Demo](https://inventory-management-system-9ntc.vercel.app/)** _(Replace with your actual deployment link)_

---

## Overview

This is not just another CRUD application. It's a comprehensive platform designed to demonstrate a modern, secure, and intelligent approach to data management. It combines a fast, responsive frontend with a secure backend proxy for handling AI requests, ensuring that sensitive API keys are never exposed to the client.

The system allows teams to manage inventory with granular control, gain intelligent insights through AI analysis, and visualize data in an intuitive way.

> ⚠️ **Important:**  
> To enable AI features, you must:
> 1. Add your OpenAI API key to a `.env` file inside the `/server` folder.  
> 2. Start the backend server (`server.js`).  
> Without these, AI functionalities such as the AI Audit and Chatbot **will not work**.

## Core Features

- **Full CRUD Operations:** Create, Read, Update, and Delete inventory items through an intuitive modal-based interface.
- **Real-time Search & Filtering:** Instantly search across all item attributes and filter by category or status.
- **Persistent State:** All inventory data is saved to the browser's local storage, so your data persists across sessions.
- **Automatic Status Tracking:** Item status (`In Stock`, `Low Stock`, `Discontinued`) is automatically detected and updated based on quantity.
- **Responsive Design:** A clean, mobile-first interface that works beautifully on all screen sizes.

...

## 🚀 Getting Started

To run this project locally, you will need to run two separate processes: the frontend Vite server and the backend Express server.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- **An OpenAI API Key (Required for AI features)**

### Installation & Setup

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. **Setup the Frontend:**
    ```bash
    # Install frontend dependencies
    npm install
    ```

3. **Setup the Backend Server:**
    ```bash
    # Navigate to the server directory
    cd server
    # Install backend dependencies
    npm install

    # Create a .env file in the 'server' directory
    touch .env
    ```

4. **Add your OpenAI API key to `.env`:**
    ```
    OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

### Running the Application

You will need **two separate terminals** open.

> **A Note on the Two-Server Setup**
>
> The backend server (`server/server.js`) is **not optional**. It acts as a secure proxy to handle all communication with the OpenAI API.  
> 🧠 **If this server is not running or the API key is missing, all AI-powered features will fail**, including the AI Audit, chatbot, and data entry assistants.
>
> ✅ Make sure your `.env` file contains your OpenAI API key, and that the backend is running.

- **In Terminal 1 (Frontend):**
    ```bash
    # From the root project directory
    npm run dev
    ```
    Your React application will be running at `http://localhost:5173`.

- **In Terminal 2 (Backend):**
    ```bash
    # From the 'server' directory
    npm start
    ```
    Your secure AI server will be running at `http://localhost:3001`.

...