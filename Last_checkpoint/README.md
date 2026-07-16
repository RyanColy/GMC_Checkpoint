# GoMyCode — MSc Computer Science Checkpoint
### Teddy Steve Ryan Eteya COLY

---

## About Me

I am a Full-Stack Developer trained through the **GoMyCode / Woolf University MSc Computer Science** program. Over the course of this intensive bootcamp, I built a solid foundation across the entire web development stack — from HTML/CSS fundamentals to real-time backend systems, cloud infrastructure, and software architecture.

I am ready to step into a professional role as a **Full-Stack Developer** and contribute to ambitious projects from day one.

---

## Skills Gained During the Bootcamp

### Frontend
- **HTML5 / CSS3** — Semantic markup, responsive layouts, Flexbox, Grid
- **Bootstrap & Tailwind CSS** — Utility-first styling, component libraries
- **JavaScript (ES6+)** — DOM manipulation, async/await, Promises, Fetch API
- **React.js** — Hooks, Context API, React Router, Redux, state management
- **TypeScript** — Typed components, interfaces, generics
- **Next.js** — SSR, SSG, file-based routing

### Backend
- **Node.js / Express.js** — REST API design, middleware, routing
- **Socket.IO** — Real-time bidirectional communication
- **WebRTC** — Peer-to-peer audio/video calls, STUN/TURN infrastructure
- **JWT Authentication** — Token-based auth, bcrypt password hashing
- **Multer / AWS S3** — File upload handling, cloud storage

### Database
- **MongoDB / Mongoose** — NoSQL schema design, aggregation, indexing
- **MongoDB Atlas** — Cloud database management

### Algorithms & Architecture
- **Data Structures** — Arrays, Trees, Graphs, Hash Maps
- **Algorithms** — Sorting, Recursion, Dynamic Programming, Dijkstra
- **OOP** — Classes, inheritance, design patterns
- **Low-Level Design** — System modeling, LMS/OOP design
- **Microservices & Containerization** — Service decomposition, Docker basics

### DevOps & Deployment
- **Git / GitHub** — Version control, branching, pull requests
- **Azure / Render / Vercel** — Cloud deployment, CI/CD basics
- **REST API design** — CRUD operations, status codes, pagination

---

## Lab Phase Final Project — NexTalk

> A production-grade real-time messaging application — Expert Level

**NexTalk** is a full-featured chat platform built from scratch as the capstone project of the program. It demonstrates the integration of every skill learned throughout the bootcamp.

### Features

- **Authentication** — Register/login with JWT, unique `@handle` per user
- **Real-time messaging** — Text, voice notes, images, videos, and file attachments
- **Message status** — Sent / Delivered / Read indicators
- **Typing indicator** — Live typing feedback
- **Group conversations** — Create groups, manage members
- **1-on-1 & group audio/video calls** — Powered by WebRTC (mesh topology for groups)
- **File uploads** — Up to 50 MB, stored on AWS S3
- **TURN server** — Coturn on VPS for NAT traversal, HMAC-SHA1 credentials
- **Online/offline status** — Real-time presence tracking

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Socket.IO Client, Axios |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB Atlas, Mongoose |
| Real-time | Socket.IO (messaging), WebRTC (calls) |
| Storage | AWS S3, Multer |
| Auth | JWT, bcrypt |
| Infrastructure | TURN (Coturn), STUN (Google) |
| Deployment | Vercel (client), Render (server), MongoDB Atlas |

### Architecture

```
React.js SPA  ──HTTP/WS──►  Node.js/Express  ──Mongoose──►  MongoDB Atlas
     │                            │                                │
     │         WebSocket          │                         AWS S3 Storage
     └──Socket.IO────────────────►│
     │                            │
     └──WebRTC P2P (or TURN)──────┘
```

---

## Bootcamp Journey

Over the program I completed **50+ checkpoints** covering:

`HTML` → `CSS` → `Bootstrap` → `JavaScript` → `DOM` → `APIs` → `Node.js` → `Express` → `MongoDB` → `REST API` → `React` → `Redux` → `TypeScript` → `Next.js` → `Algorithms` → `Data Structures` → `OOP` → `System Design` → `Microservices` → `Deployment` → **Lab Phase (NexTalk)**

---

## Career Readiness

I am fully prepared to:

- Build and ship full-stack web applications independently
- Collaborate on engineering teams using Git workflows and code review
- Design scalable backend APIs and real-time systems
- Implement secure authentication and cloud infrastructure
- Tackle algorithmic challenges and system design interviews

I am actively looking for opportunities as a **Full-Stack Developer** (React / Node.js) where I can continue to grow and deliver real impact.

---

**Contact:** ryan.coly999@gmail.com  
**Program:** MSc Computer Science — GoMyCode / Woolf University  
**Year:** 2026
