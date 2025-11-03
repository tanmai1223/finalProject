# 🚀 API Tracer Management System

A complete **API Monitoring & Management Dashboard** that helps developers **track, analyze, and control API performance** in real-time.  
This project includes a **frontend dashboard**, **backend service**, and a **plug-and-play Express middleware** for API tracing.

---

## 🧩 Overview

The **API Tracer Management System** allows teams to:

- ✅ Track success and failure rates of APIs with real-time visual indicators  
- 🔍 View detailed logs (status codes, response times, and timestamps)  
- 📈 Analyze uptime, success/error ratios, and monthly API trends  
- ⚙️ Control API states — ON/OFF, Tracer toggle, Rate limiting, and Scheduler (Cron Jobs)  

---

## 🖥️ Screenshots

### 🏠 Dashboard  
Shows all APIs with **green (success)** and **red (failure)** indicators, and monthly activity.

![Dashboard Screenshot]<img width="1898" height="878" alt="image" src="https://github.com/user-attachments/assets/b3f91c55-0e75-4492-9848-e0dc8c18dbfa" />
---

### 📋 Tracer Details  
Displays each API's **log history**, including **execution time**, **status**, and **error info**.

![Tracer Details Screenshot](<img width="1898" height="875" alt="image" src="https://github.com/user-attachments/assets/4ad69766-5a79-4967-be36-0303287f0627" />
)

---

### 📊 Analytics  
Visualizes **uptime graphs**, **success/failure ratio**, and **performance statistics**.

![Analytics Screenshot](<img width="1903" height="882" alt="image" src="https://github.com/user-attachments/assets/b483c29e-4583-4199-9885-a70d8196b671" />
)

---

### ⚙️ Controls  
Toggle **API**, **Tracer**, apply **Rate Limiters**, or set **Schedule Windows** for tracing.

![Controls Screenshot](<img width="1920" height="882" alt="image" src="https://github.com/user-attachments/assets/84794fc2-48b4-4b08-b07b-3fb82655ef6e" />
)

---

## ⚙️ How It Works

A **custom Express middleware** automatically:

1. Logs every API call and console output  
2. Sends the trace data to the tracer backend  
3. Applies dynamic rate limiting and scheduling based on control settings  

**Middleware Example:**
```js
import logMiddleware from "./middleware/logMiddleware.js";
app.use(logMiddleware());
```
## 🛠️ Tech Stack
| Category | Technology                           |
| -------- | ------------------------------------ |
| Frontend | React.js, Chart.js, CSS              |
| Backend  | Node.js, Express.js                  |
| Database | MongoDB                              |
| Tools    | Cron, Express-Rate-Limit             |
| Hosting  | Render (Backend), Netlify (Frontend) |

## 🌐 Live Demo

🔗 Frontend: https://apitracer.netlify.app/

🔗 Backend: https://finalprojectb-igcx.onrender.com

## 🚀 Getting Started
1️⃣ Clone the Repository
```
git clone https://github.com/<your-username>/api-tracer-management.git
```

2️⃣ Install Dependencies
```
cd api-tracer-management
npm install
```

3️⃣ Run the App
```
npm run dev
```

## 📡 Middleware Integration

Add the middleware in your backend project:
```
import logMiddleware from "./middleware/logMiddleware.js";
app.use(logMiddleware());
```


It automatically traces logs, errors, and response times for every endpoint.

## 📊 Future Enhancements

🔐 Authentication & Role-Based Access

📩 Email Alerts for API Downtime

☁️ Cloud Storage for Logs

📅 Custom Reports & Date-Range Filtering

## 👨‍💻 Author

Hekkadka Tanmai
📍 Hyderabad, Telangana
📧 htanmai.23@gmail.com
