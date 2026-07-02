# 🚌 DTC Bus Schedule Management System

A full-stack web application that provides an easy and efficient way to view and manage Delhi Transport Corporation (DTC) bus schedules. The project offers a clean user interface for passengers and a REST API for managing bus information.

## 📌 Overview

The DTC Bus Schedule Management System helps users access bus routes and timings from a centralized platform. It simplifies searching for buses and provides an organized way to manage schedule data through a backend API.

## ✨ Features

* View all available DTC bus routes
* Display bus schedules and timings
* Responsive and user-friendly interface
* RESTful API integration
* Add new bus records through the backend
* Fast frontend with React and Vite
* API testing using Postman


## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* HTML5
* CSS3
* JavaScript (ES6+)

### Backend

* Node.js
* Express.js

### Tools

* VS Code
* Postman
* Git
* GitHub

---

## 📂 Project Structure

```
DTC-Bus-Schedule/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── data/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/DTC-Bus-Schedule.git
```

### 2. Navigate to the project

```bash
cd DTC-Bus-Schedule
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

---

## ▶️ Running the Project

### Start Backend

```bash
npm start
```

or

```bash
node server.js
```

### Start Frontend

```bash
cd client
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

---

## 📡 API Endpoints

### Get all buses

```
GET /api/buses
```

Returns the list of all available buses.

---

### Add a new bus

```
POST /api/buses
```

Example request body:

```json
{
  "routeNumber": "534",
  "source": "Anand Vihar",
  "destination": "Nehru Place",
  "departureTime": "08:30 AM"
}
```

---

## 🎯 Problem Statement

Passengers often struggle to find accurate and organized information about DTC bus routes and schedules. Existing solutions may be difficult to navigate or lack a centralized interface.

This project addresses that challenge by providing a simple, responsive, and efficient platform to view and manage DTC bus schedule information.

---

## 💡 Key Learnings

* Building REST APIs with Express.js
* React component-based development
* Frontend and backend integration
* State management using React Hooks
* API testing with Postman
* Version control using Git and GitHub

---

## ⚡ Challenges Faced

* Configuring communication between frontend and backend
* Handling CORS issues
* Managing application state in React
* Structuring REST APIs
* Testing and debugging endpoints

---

## 🔮 Future Enhancements

* User authentication
* Admin dashboard
* Search and filter buses
* Real-time bus tracking
* Live arrival predictions
* Database integration (MongoDB/MySQL)
* Route visualization using maps
* Mobile-responsive improvements

---

## 📷 Screenshots

Add screenshots of the application here.

```
Home Page

Bus Schedule Page

Admin Panel

API Response
```

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Raj**

If you found this project useful, consider giving it a ⭐ on GitHub.
