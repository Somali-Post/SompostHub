# Somali Post — Staff Hub

**Official Internal Operations Portal**

A high-performance, dual-interface web application designed for Somali Postal Service staff and management. It consolidates messaging, mail processing, tracking, and administrative oversight into a single secure workspace.

---

## 🚀 Key Features

### 📦 Operations
*   **High-Speed Scanning:** Desktop-optimized barcode scanning with "Batch Mode" for rapid entry.
*   **Smart S10 Parsing:** Automatically detects country of origin (e.g., `SE` -> Sweden) and mail type (EMS/Parcel) from UPU barcodes.
*   **Track & Trace:** Integrated with UPU PTT standards to show detailed event history and "Human-Readable" status updates.
*   **Delivery Verification:** Mobile-first flow for drivers to capture proof of delivery (Photo + ID).

### 💬 Communication
*   **Real-Time Chat:** Internal messaging system for Logistics, Delivery, and Management teams.
*   **Video & Voice Calls:** Integrated **Daily.co** video calling directly within the chat interface.
*   **Notification Center:** Centralized system alerts, task reminders, and service enquiries.

### 🛡️ Administration
*   **Ops Dashboard:** Real-time KPIs (Volume, Weight, Staff Online) backed by live database aggregation.
*   **Staff Management:** Create users, manage roles, and perform **Secure PIN Resets**.
*   **Audit Log:** Immutable record of critical actions (logins, resets, deliveries) for security compliance.

---

## 🎨 Dual-UI Architecture

This project uses a unique **Adaptive Interface** strategy to serve two distinct use cases from a single codebase:

| **Desktop View (`md:flex`)** | **Mobile View (`md:hidden`)** |
| :--- | :--- |
| **Style:** Government Enterprise | **Style:** Native App Feel |
| **Nav:** Persistent Sidebar | **Nav:** Bottom Sheets & Wavy Headers |
| **Focus:** Data Density & Management | **Focus:** Tactile Buttons & Field Operations |
| **Tech:** Standard Responsive Grid | **Tech:** Fixed Positioning, No-Scroll Layouts |

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + `sonner` (Toast Notifications)
*   **Database:** PostgreSQL (via [Supabase](https://supabase.com))
*   **ORM:** Prisma
*   **Auth:** Custom JWT (HttpOnly Cookies) + Middleware Protection
*   **Video:** Daily.co WebRTC
*   **Icons:** Lucide React

---

## ⚡ Getting Started

### 1. Prerequisites
*   Node.js 18+
*   A Supabase Project (Postgres)

### 2. Installation
```bash
git clone https://github.com/your-repo/postal-app.git
cd postal-app
npm install