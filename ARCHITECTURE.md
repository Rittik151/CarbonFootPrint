# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  (Chrome, Firefox, Safari, Edge, Mobile Browsers)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              React Components                            │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • Header (Navigation + Mobile Menu)                    │   │
│  │  • Footer                                               │   │
│  │  • LoginModal (Register/Login)                          │   │
│  │  • Calculator Page                                      │   │
│  │  • Profile Page                                         │   │
│  │  • Dashboard Page                                       │   │
│  │  • Resources/Articles Pages                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │                                        │
│                         │ Uses                                   │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         API Service (Axios)                              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • Handles all HTTP requests                            │   │
│  │  • Token management                                     │   │
│  │  • Error handling                                       │   │
│  │  • Request/Response interceptors                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Responsive Styles (CSS)                          │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • Mobile-first design                                  │   │
│  │  • Grid & Flexbox layouts                               │   │
│  │  • Media queries                                        │   │
│  │  • Responsive typography                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Local Storage                                    │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • JWT Token                                            │   │
│  │  • User Information                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ RESTful API Calls (JSON)
                         │ Port: 3000 / 5000 / 8000
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                BACKEND (Node.js + Express)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Server (Express.js)                           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Port: 5000                                             │   │
│  │  CORS Enabled                                           │   │
│  │  Error Handling                                         │   │
│  │  Request Logging                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │                                        │
│                         │ Routing                                │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              API Routes                               │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  /api/auth/          → Authentication                │       │
│  │  /api/users/         → User Management               │       │
│  │  /api/calculator/    → Calculations                  │       │
│  │  /api/articles/      → Articles                      │       │
│  │  /api/resources/     → Resources                     │       │
│  └──────────────────────────────────────────────────────┘       │
│                         │                                        │
│                         │ Uses                                   │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────┐       │
│  │           Middleware                                  │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  • JWT Authentication                                │       │
│  │  • Request Parsing                                  │       │
│  │  • Error Handling                                   │       │
│  │  • CORS Headers                                     │       │
│  └──────────────────────────────────────────────────────┘       │
│                         │                                        │
│                         │ Data Operations                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────┐       │
│  │           Models (Mongoose)                           │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  • User                                              │       │
│  │  • Calculation                                       │       │
│  │  • Article                                           │       │
│  │  • Resource                                          │       │
│  └──────────────────────────────────────────────────────┘       │
│                         │                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ MongoDB Protocol
                         │ Port: 27017
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                  DATABASE (MongoDB)                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collections:                                                    │
│  ├── users          (Authentication & Profiles)                 │
│  ├── calculations   (Carbon Footprint Data)                     │
│  ├── articles       (Educational Content)                       │
│  └── resources      (Learning Materials)                        │
│                                                                   │
│  Features:                                                       │
│  ├── Data Validation (Schemas)                                  │
│  ├── Indexing (Performance)                                     │
│  ├── Relationships (References)                                 │
│  └── Timestamps                                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Registration Flow
```
┌─────────────────┐
│  User Opens App │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  Clicks Sign Up      │
└────────┬─────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  LoginModal Opens                   │
│  Shows Registration Form            │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  User Fills Form                    │
│  • Username                         │
│  • Email                            │
│  • Password                         │
│  • First/Last Name                  │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Submit Form                        │
│  → POST /api/auth/register          │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Backend:                           │
│  • Validate Input                   │
│  • Hash Password (bcryptjs)         │
│  • Create User Record               │
│  • Generate JWT Token               │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Return Response:                   │
│  {                                  │
│    token: "eyJ...",                 │
│    user: { id, username, email }    │
│  }                                  │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Frontend:                          │
│  • Store Token in localStorage      │
│  • Store User Info                  │
│  • Close Modal                      │
│  • Update Header (Show Username)    │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  User Logged In ✓                   │
│  Access to Calculator & Dashboard   │
└────────────────────────────────────┘
```

### Carbon Calculation Flow
```
┌──────────────────────────┐
│  User on Calculator Page │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Selects Activity Type:              │
│  • Transportation                    │
│  • Energy                            │
│  • Food                              │
│  • Waste                             │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Selects Specific Type:              │
│  (e.g., "car" for transportation)    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Enters Value (quantity)             │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Clicks Calculate                    │
│  POST /api/calculator/calculate      │
│  {                                   │
│    type: "transportation",           │
│    subtype: "car",                   │
│    value: 100                        │
│  }                                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Backend:                            │
│  • Validates Input                   │
│  • Gets Emission Factor:             │
│    car = 0.21 kg CO2 per km          │
│  • Calculates: 100 × 0.21 = 21      │
│  • Saves to DB                       │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Returns:                            │
│  {                                   │
│    carbonEmission: 21,               │
│    calculation: { ... }              │
│  }                                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Frontend:                           │
│  • Shows Result: "21 kg CO2"         │
│  • Updates History List              │
│  • Updates Total Emissions           │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  User Sees Results ✓                 │
│  Can View History                    │
└──────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Navigation Menu
│   ├── Mobile Hamburger Menu
│   └── LoginModal
│       └── Auth Forms
├── Routes
│   ├── Home Page
│   ├── Calculator Page
│   │   ├── Calculator Form
│   │   └── Results Display
│   ├── Resources Page
│   ├── Article Page
│   ├── Dashboard Page
│   └── Profile Page
│       ├── Profile Header
│       ├── Edit Form
│       └── User Info
└── Footer
    ├── Links
    ├── Contact Info
    └── Copyright
```

## State Management Flow

```
localStorage
    │
    ├── token (JWT)
    │
    └── user
        ├── id
        ├── username
        ├── email
        └── firstName
        
        │
        ▼
        
React Components
    │
    ├── useEffect (check login on mount)
    │
    ├── useState (form data)
    │
    └── API Service
        │
        └── Axios Instance
            │
            ├── Request Interceptor
            │   └── Add token to headers
            │
            └── Response Interceptor
                └── Handle errors
```

## Request/Response Cycle

```
Frontend
  │
  └─→ Axios API Service
        │
        └─→ Request Interceptor
              │
              ├─ Add Authorization Header
              ├─ Set Content-Type
              └─ Add Body Data
                  │
                  ▼
              HTTP Request
                  │
                  ▼
Backend (Express)
    │
    └─→ Route Handler
          │
          ├─→ CORS Middleware ✓
          ├─→ Body Parser ✓
          ├─→ Auth Middleware (if needed)
          │   └─ Verify JWT Token
          └─→ Route Logic
                │
                ├─ Validate Input
                ├─ Database Query/Update
                └─ Return JSON Response
                    │
                    ▼
              HTTP Response
                  │
                  ▼
Frontend
    │
    └─→ Response Interceptor
          │
          ├─ Check Status
          ├─ Parse JSON
          └─ Handle Errors
                │
                ▼
          Component State Update
                │
                ▼
          Re-render UI
```

---

This architecture provides a clean separation of concerns with the frontend handling the UI/UX and the backend handling data processing and security.
