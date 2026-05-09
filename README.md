# ExpertBook - Real-Time Expert Session Booking Platform

ExpertBook is a premium, full-stack MERN application that allows users to book 1-on-1 mentorship sessions with industry experts. It features a highly aesthetic UI, real-time slot synchronization, and atomic booking operations to handle high-concurrency race conditions.

## 🚀 Features

### Screen 1: Expert Listing
- **Expert Discovery**: View expert profiles including name, specialization, experience, and ratings.
- **Advanced Filtering**: Search by name (debounced) and filter by category.
- **Server-Side Pagination**: Efficient data fetching with pagination support.
- **Rich UI**: Skeleton loaders and elegant glassmorphism design.

### Screen 2: Expert Detail
- **Detailed Profile**: Comprehensive view of expert's credentials.
- **Grouped Time Slots**: Intelligent slot grouping by date for better readability.
- **Real-Time Availability**: Slots update in real-time across all connected clients using **Socket.io** when a booking occurs.
- **Visual Feedback**: Booked slots are automatically disabled and grayed out.

### Screen 3: Booking Flow
- **Comprehensive Form**: Name, Email, Phone, Date, Time, and Notes.
- **Strict Validation**: Frontend validation for email formats, phone numbers, and required fields.
- **Race Condition Prevention**: Implemented with **Atomic MongoDB Updates** (`findOneAndUpdate`) to ensure a slot can never be booked twice simultaneously.
- **Success States**: Beautiful confirmation screen upon successful reservation.

### Screen 4: My Bookings (The Ledger)
- **Email-Based Retrieval**: Securely look up your sessions using your email.
- **Status Tracking**: Visual badges for **Pending**, **Confirmed**, and **Completed** statuses.
- **Mentorship Chat**: Real-time communication channel with mentors for booked sessions.

## 🛠️ Technical Stack

- **Frontend**: React, Vite, Tailwind CSS, TanStack Query (React Query), Lucide React, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **State Management**: React Context & TanStack Query.
- **Design**: Premium Classic Aesthetic with Glassmorphism and Custom UI Tokens.

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd expert-book
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # CLIENT_URL=http://localhost:5173
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create a .env file with:
   # VITE_API_URL=http://localhost:5000/api
   # VITE_SOCKET_URL=http://localhost:5000
   npm run dev
   ```

## 🛡️ Atomic Double-Booking Guard

To handle race conditions properly, the application uses MongoDB's atomic `findOneAndUpdate` operation. This ensures that the check for slot availability and the booking update happen in a single database transaction:

```javascript
const expert = await Expert.findOneAndUpdate(
  { 
    _id: expertId, 
    "availableSlots._id": slotId,
    "availableSlots.isBooked": false 
  },
  { $set: { "availableSlots.$.isBooked": true } },
  { new: true }
);
```

If the slot was already booked by another user during the request process, the query fails to find a match (`isBooked: false`), and a `409 Conflict` error is returned gracefully.
