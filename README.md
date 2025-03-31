# Real-Time Chat Application

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**. This application allows users to communicate in real-time, manage their profiles, and view chat history.

---

## Features

### Authentication

- User registration with validation.
- Login with email and password.
- Google OAuth login integration.
- Token-based authentication using JWT.
- Secure cookie storage for tokens.
- Logout functionality.

### Real-Time Messaging

- Real-time communication using **Socket.IO**.
- Send and receive messages instantly.
- Broadcast online users to all connected clients.

### User Management

- View all users except the currently logged-in user.
- Update and delete profile pictures.

### Chat History

- Retrieve chat history between two users.
- Store messages in MongoDB with timestamps.
- Support for text and image messages.

### Online Status

- Display online/offline status of users in real-time.

### Cloudinary Integration

- Upload profile pictures to Cloudinary.
- Images from message are aslo stored in Cloudinary.

### Validation

- Input validation using **Yup** for FrontEnd.
- Input validation using **Joi** for BackEnd.

---

## Tech Stack

### Frontend

- **React** with **Vite** for fast development.
- **Zustand** for state management.
- **Tailwind CSS** and **daisyUI** used for UI design.
- **Socket.IO Client** for real-time communication.

### Backend

- **Node.js** with **Express** for server-side logic.
- **Socket.IO** for WebSocket communication.

- **MongoDB** with **Mongoose** for database management.
- **Cloudinary** for image storage.

---

## Installation

### Prerequisites

- Node.js installed on your machine.
- MongoDB connection string.
- Cloudinary account for image uploads.

## React+vite

### Installation

1. **Create a new Vite project**:

   Open your terminal and run the following command to create a new Vite project:

   ```bash
   npm create vite@latest
   ```

2. **Navigate to the project directory**:
   ```
   cd your-project-name
   ```
3. **Install dependencies**:

   ```
   npm  install
   ```

### Running the Application

1. **Start the development server**:

   ```
   npm run dev
   ```

   - This will start the Vite development server. Open your browser and navigate to http://localhost:5173 to see your application running.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## NodeJs Installation

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine. You can download it from [here](https://nodejs.org/).

### Steps

1. **Initialize a new Node.js project**

   Open your terminal and run the following command to create a new Node.js project:

   ```bash
   npm init -y
   ```

- This will create a package.json file in your project directory.

2. Install Express.js

   - Run the following command to install Express.js:

   ```
   npm install express
   ```

3. Create a basic Express server

   - Create a new file named server.js and add the following code to set up a basic Express server:

```
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
res.send('Hello World!');
});

app.listen(port, () => {
console.log(`Server is running at http://localhost:${port}`);
});
```
