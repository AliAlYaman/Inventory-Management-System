# Advanced AI Inventory Management System

A feature-rich, modern inventory management system built with React, Vite, and TypeScript, supercharged with a suite of powerful AI capabilities from OpenAI.

**[➡️ View Live Demo](https://your-deployment-link.vercel.app/)** _(Replace with your actual deployment link)_

---

## Overview

This is not just another CRUD application. It's a comprehensive platform designed to demonstrate a modern, secure, and intelligent approach to data management. It combines a fast, responsive frontend with a secure backend proxy for handling AI requests, ensuring that sensitive API keys are never exposed to the client.

The system allows teams to manage inventory with granular control, gain intelligent insights through AI analysis, and visualize data in an intuitive way.

## Core Features

- **Full CRUD Operations:** Create, Read, Update, and Delete inventory items through an intuitive modal-based interface.
- **Real-time Search & Filtering:** Instantly search across all item attributes and filter by category or status.
- **Persistent State:** All inventory data is saved to the browser's local storage, so your data persists across sessions.
- **Automatic Status Tracking:** Item status (`In Stock`, `Low Stock`, `Discontinued`) is automatically detected and updated based on quantity.
- **Responsive Design:** A clean, mobile-first interface that works beautifully on all screen sizes.

## ✨ Advanced AI-Powered Features

This application leverages the power of Large Language Models (LLMs) to provide intelligent features that go far beyond simple data entry.

### 🚀 The AI Inventory Audit

The flagship feature of this platform is the **AI Inventory Audit**. With a single click, you can command the AI to perform a comprehensive analysis of your entire inventory. The AI acts as an expert supply chain analyst, providing a professional report that includes:

-   **An Executive Summary:** A quick overview of key metrics like total item count and total inventory value.
-   **Key Insights:** The AI identifies important trends and anomalies, such as your most valuable items, categories with critically low stock, or items that haven't been updated in a long time.
-   **Actionable Suggestions:** The report concludes with clear, actionable recommendations, like suggesting which specific items to reorder or which categories might need a pricing review.

This powerful tool transforms raw data into strategic business intelligence.

### Other AI Capabilities

-   **Conversational AI Assistant:** A floating chatbot that has full context of your inventory. Ask complex questions in natural language, like "What is the total value of my electronics?" or "Which items are low on stock?".
-   **Predictive Restock Forecasting:** The system uses AI to analyze an item's sales history and current stock level to predict *when* it will need to be reordered, helping you prevent stockouts before they happen.
-   **AI-Assisted Data Entry:**
    -   **Smart Description Generation:** Automatically generate professional, concise product descriptions based on an item's name and category.
    -   **Intelligent Category Suggestion:** Let the AI suggest the most appropriate category for a new item, reducing manual errors.

## 📊 Data Visualization & Export

-   **Interactive Inventory Heatmap:** A visual dashboard component that displays the total value of each inventory category as a color-coded grid. This allows for a quick, at-a-glance understanding of your inventory's composition.
-   **Customizable CSV Export:** Export your inventory data to a CSV file with full control. A user-friendly modal allows you to select exactly which columns to include in your report.

## 🔐 Role-Based Access Control (RBAC)

A secure, frontend-enforced RBAC system ensures that team members only have access to the features and data they are authorized to see. The application simulates three roles:

-   **Admin:** Full, unrestricted access to all features, including deleting items, viewing financial data, and running audits.
-   **Manager:** Has most permissions, including creating and editing items.
-   **Staff:** A restricted role with limited permissions. Staff can view inventory and edit certain fields (like quantity) but cannot create or delete items, view sensitive data like price, or run advanced reports.

## 🛠️ Technology Stack

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS
-   **AI:** OpenAI (via the Vercel AI SDK)
-   **Backend (Proxy Server):** Node.js, Express
-   **UI Components:** Custom-built, responsive components
-   **Utilities:** `papaparse` for CSV export

## 🚀 Getting Started

To run this project locally, you will need to run two separate processes: the frontend Vite server and the backend Express server.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   An OpenAI API Key

### Installation & Setup

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd <repository-folder>
    \`\`\`

2.  **Setup the Frontend:**
    \`\`\`bash
    # Install frontend dependencies
    npm install
    \`\`\`

3.  **Setup the Backend Server:**
    \`\`\`bash
    # Navigate to the server directory
    cd server

    # Install backend dependencies
    npm install

    # Create a .env file in the 'server' directory
    # and add your OpenAI API key
    echo "OPENAI_API_KEY=sk-..." > .env
    \`\`\`

### Running the Application

You will need **two separate terminals** open.

-   **In Terminal 1 (Frontend):**
    \`\`\`bash
    # From the root project directory
    npm run dev
    \`\`\`
    Your React application will be running at `http://localhost:5173`.

-   **In Terminal 2 (Backend):**
    \`\`\`bash
    # From the 'server' directory
    npm start
    \`\`\`
    Your secure AI server will be running at `http://localhost:3001`.

Now, open `http://localhost:5173` in your browser to use the application.

---

This project was created to demonstrate best practices in modern web development, including secure API handling, advanced AI integration, and thoughtful UX design.