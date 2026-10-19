# Datheon Full Stack Web Development Internship 🚀

[![Internship Status](https://img.shields.io/badge/Datheon%20Internship-Batch%2001%20Confirmed-brightgreen)](https://www.datheon.in/verify?id=DT-2026-YQFWW)
[![Application ID](https://img.shields.io/badge/Application%20ID-DT--2026--YQFWW-blue)](https://www.datheon.in/verify?id=DT-2026-YQFWW)
[![Student](https://img.shields.io/badge/Student-Paras%20Nakum-orange)](mailto:parasnakum0261@gmail.com)
[![Tasks Completed](https://img.shields.io/badge/Milestones-4%2F4%20Completed-success)]()

This repository contains the complete project engineering submissions for the **Datheon Full Stack Web Development Internship (Batch 01)**. All 4 curriculum tasks have been designed, coded, tested, and documented.

---

## 👨‍💻 Student Credential & Verification
- **Intern Name:** Paras Nakum
- **Registered Email:** [parasnakum0261@gmail.com](mailto:parasnakum0261@gmail.com)
- **Application ID:** `DT-2026-YQFWW`
- **Academic Institute:** R. B. Institute of Management Studies (MCA)
- **Official Registry Credential:** [Verify on Datheon Registry](https://www.datheon.in/verify?id=DT-2026-YQFWW)

---

## 📂 Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── index.html                     # Master Submission Portal showcasing all 4 tasks
├── README.md                      # Directorate documentation and setup instructions
│
├── task1-portfolio/               # TASK 1: Responsive Developer Portfolio
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── task2-task-manager/            # TASK 2: TaskMaster Pro (Productivity CRUD App)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── task3-weather-app/             # TASK 3: Live Weather Telemetry Dashboard
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── task4-ecommerce-store/         # TASK 4: NexStore E-Commerce Storefront
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 🌟 Task Overviews & Technical Specifications

### Task 1: Modern Developer Portfolio
Construct a sleek, mobile-first developer portfolio tailored to Paras Nakum's credentials, education, and technical stack.
- **Key Features:**
  - Semantic HTML5 structure (Header, Hero, About, Skills Grid, Featured Projects, Timeline, Contact).
  - Dark / Light theme toggle with state preserved in `localStorage`.
  - Responsive CSS Flexbox & CSS Grid layouts with smooth scroll navigation.
  - Interactive project modal popups to view software architectures.
  - Client-side validated contact form with interactive toast notifications.
- **Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Font Awesome.
- **Launch:** Open `task1-portfolio/index.html`.

---

### Task 2: TaskMaster Pro (Productivity CRUD Application)
A productivity application supporting full Create, Read, Update, and Delete (CRUD) operations.
- **Key Features:**
  - **CRUD Engine:** Instant task creation, in-place modal editing, task deletion, and completion toggles.
  - **Categorization:** Classify tasks into Work, Study, Personal, and Coding categories.
  - **Priority & Due Dates:** Set priority tags (High, Medium, Low) and due dates.
  - **Persistence:** Instant browser `localStorage` syncing ensuring tasks survive page refreshes.
  - **Filtering & Search:** Real-time search query filtering, status filtering (All, Active, Completed), and category dropdown filters.
  - **Telemetry Metrics:** Real-time calculation of Total Tasks, Pending Tasks, Completed Tasks, and Completion Velocity rate.
- **Tech Stack:** JavaScript (ES6+), DOM Manipulation API, LocalStorage API, Modern CSS.
- **Launch:** Open `task2-task-manager/index.html`.

---

### Task 3: Live Weather Telemetry Application
A live global weather dashboard retrieving real-time atmospheric metrics and 5-day forecasts.
- **Key Features:**
  - **Global City Search:** Search any global city or click quick shortcuts (Surat, Mumbai, Tokyo, London, New York).
  - **Real-Time Telemetry:** Current temperature, humidity, wind velocity, atmospheric pressure, and visibility metrics.
  - **5-Day Forecast:** Daily temperature highs, lows, and weather projections rendered using `Array.map()`.
  - **Dynamic Backgrounds:** Background gradient changes dynamically based on weather conditions (Sunny, Clear Night, Rainy, Cloudy, Thunderstorm).
  - **Error & Loading Handling:** Loading spinners and informative error banners for invalid city queries.
  - **Zero Key Dependency:** Uses reliable Open-Meteo Geocoding & Weather Telemetry with zero rate limits or expiration failures.
- **Tech Stack:** Fetch API, Async/Await, CSS Flexbox/Grid, SVG & FontAwesome Icons.
- **Launch:** Open `task3-weather-app/index.html`.

---

### Task 4: NexStore E-Commerce Storefront
A full-featured modern e-commerce storefront consuming real-time product catalogs.
- **Key Features:**
  - **API Integration:** Fetches product catalog dynamically from `FakeStoreAPI` (`https://fakestoreapi.com/products`) with ratings, descriptions, prices, and badges.
  - **Category Filtering & Search:** Filter by Men's Clothing, Women's Clothing, Jewelery, Electronics, plus instant title search.
  - **Sorting:** Sort products by Featured, Price (Low to High), Price (High to Low), or Customer Ratings.
  - **Slide-out Cart Drawer:** Smooth slide-out cart with quantity increment/decrement, remove item, subtotal, 8% tax calculation, and free shipping threshold ($50+).
  - **Cart State Persistence:** Cart items persist in browser `localStorage`.
  - **Simulated Checkout:** Checkout modal with shipping address inputs, mock payment option, and order confirmation receipt generation.
- **Tech Stack:** JavaScript (ES6+), FakeStoreAPI, CSS Grid, State Management.
- **Launch:** Open `task4-ecommerce-store/index.html`.

---

## 🚀 How to Run Locally

1. **Clone this repository:**
   ```bash
   git clone https://github.com/parasnakum0261/Datheon_Full_Stack_Web_Development_Internship.git
   ```
2. **Navigate into the folder:**
   ```bash
   cd Datheon_Full_Stack_Web_Development_Internship
   ```
3. **Open the submission hub in your browser:**
   - Double click `index.html` or open via VS Code Live Server.
   - From the hub, you can directly launch Task 1, Task 2, Task 3, and Task 4.

---

## 🌐 Live Deployment Instructions (GitHub Pages / Vercel)

### Option A: GitHub Pages (Recommended)
1. In your GitHub repository `Datheon_Full_Stack_Web_Development_Internship`, click **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select `main` branch and `/ (root)` folder, then click **Save**.
4. Your site will be live at:
   `https://<your-github-username>.github.io/Datheon_Full_Stack_Web_Development_Internship/`

### Option B: Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import `Datheon_Full_Stack_Web_Development_Internship`.
3. Keep default settings and click **Deploy**.

---

## 📋 Datheon Submission Checklist

| Datheon Form Field | Submitted Details | Status |
| :--- | :--- | :---: |
| **GitHub Repository URL** | `https://github.com/<your-username>/Datheon_Full_Stack_Web_Development_Internship` | ✅ Ready |
| **Completed Tasks** | Task 1, Task 2, Task 3, Task 4 (All 4 Completed) | ✅ 100% |
| **Application ID** | `DT-2026-YQFWW` | ✅ Verified |
| **Intern Candidate** | Paras Nakum (parasnakum0261@gmail.com) | ✅ Authenticated |
| **Batch** | Batch 01 (R B Institute of Management) | ✅ Confirmed |

---

*Submitted for Datheon Directorate Certification & Evaluation.*
