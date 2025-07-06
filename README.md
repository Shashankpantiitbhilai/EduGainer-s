# 🎓 EduGainer's - Open Source Educational Management Platform

<div align="center">

![EduGainer's Logo](Frontend/public/logo.jpg)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-v4+-black.svg)](https://expressjs.com/)

**🌟 A comprehensive, open-source educational management platform designed to revolutionize how educational institutions operate.**

[Demo](https://edugainers-shashankpantiitbhilais-projects.vercel.app) • [Documentation](#documentation) • [Contributing](#contributing) • [Support](#support)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [🚀 Features](#features)
- [🏗️ Architecture](#architecture)
- [🛠️ Tech Stack](#tech-stack)
- [📦 Installation](#installation)
- [🔧 Configuration](#configuration)
- [🎯 Usage](#usage)
- [📊 Database Schema](#database-schema)
- [🤖 AI Integration](#ai-integration)
- [🔐 Security Features](#security-features)
- [📱 API Documentation](#api-documentation)
- [🎨 UI Components](#ui-components)
- [🤝 Contributing](#contributing)
- [📄 License](#license)
- [👥 Community](#community)

---

## Overview

**EduGainer's** is a modern, full-stack educational management platform built with the MERN stack. It serves as a complete solution for educational institutions, offering library management, class scheduling, student administration, AI-powered assistance, and much more.

### 🎯 Mission
To provide an open-source alternative to expensive educational management systems, making quality education administration accessible to institutions worldwide.

### ✨ Why Choose EduGainer's?

- **🆓 Completely Free & Open Source**
- **🔧 Highly Customizable**
- **⚡ Modern Tech Stack**
- **🤖 AI-Powered Features**
- **📱 Mobile-First Design**
- **🌍 Multilingual Support**
- **☁️ Cloud-Ready**

---

## 🚀 Features

### 📚 Library Management System
- **Smart Seat Booking**: Real-time seat reservation with monthly rotation
- **Digital ID Cards**: Automated PDF generation and email delivery
- **Payment Integration**: Seamless Razorpay payment processing
- **Resource Management**: Digital library with categorized resources
- **Monthly Analytics**: Comprehensive usage statistics

### 🎓 Class Management
- **Batch Creation**: Flexible class batch management
- **Student Enrollment**: Streamlined registration process
- **Faculty Assignment**: Teacher allocation and scheduling
- **Progress Tracking**: Student performance monitoring
- **Automated Notifications**: Email and SMS alerts

### 💬 Communication Hub
- **Real-time Chat**: Socket.io powered messaging
- **Announcement System**: Institution-wide broadcasts
- **Admin Dashboard**: Centralized communication control
- **Message Analytics**: Read receipts and engagement metrics

### 🤖 AI Assistant
- **Multilingual Chatbot**: English and Hindi support
- **Voice Synthesis**: Text-to-speech capabilities
- **Document Analysis**: PDF and image processing
- **Smart Responses**: Context-aware conversations
- **Learning Insights**: AI-powered recommendations

### 👥 User Management
- **Role-Based Access**: Hierarchical permission system
- **Team Accounts**: Multi-user organization support
- **OAuth Integration**: Google and custom authentication
- **Profile Management**: Comprehensive user profiles

### 📊 Analytics & Reporting
- **Dashboard Insights**: Real-time statistics
- **Usage Analytics**: Platform engagement metrics
- **Financial Reports**: Revenue and payment tracking
- **Export Capabilities**: PDF and Excel reports

---

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
├─────────────────────────────┬───────────────────────────────────────┤
│     React Frontend          │          Mobile App                   │
│   (Material-UI, Socket.io)  │        (Future Release)               │
└─────────────────────────────┴───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        LOAD BALANCER                                │
│                    Nginx / Cloudflare                               │
└─────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                              │
├─────────────────────────────┬───────────────────────────────────────┤
│      Express.js Server      │        Socket.io Server               │
│   (REST APIs, Middleware)   │     (Real-time Chat, Updates)         │
└─────────────────────────────┴───────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│   AUTHENTICATION     │  │    DATABASE LAYER    │  │ EXTERNAL SERVICES│
├──────────────────────┤  ├──────────────────────┤  ├─────────────────┤
│ • Passport.js        │  │ • MongoDB Primary    │  │ • Cloudinary    │
│ • Google OAuth       │  │ • Redis Cache        │  │ • Google AI     │
│ • JWT Tokens         │  │ • Session Store      │  │ • Razorpay      │
│ • OTP Verification   │  │ • Dynamic Collections│  │ • Gmail SMTP    │
└──────────────────────┘  └──────────────────────┘  └─────────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │   AI & ML APIs  │
                                                    ├─────────────────┤
                                                    │ • Gemini AI     │
                                                    │ • Vision API    │
                                                    │ • Translation   │
                                                    │ • Text-to-Speech│
                                                    └─────────────────┘
```

### Data Flow Architecture

```
User Action Flow:
─────────────────

[User] ──► [Frontend] ──► [API Gateway] ──► [Authentication] ──► [Database]
   ▲                                                                 │
   │                                                                 ▼
   └── [Updated UI] ◄── [JSON Response] ◄────────────────── [Query Response]

AI Feature Flow:
───────────────

[User Request] ──► [AI Service] ──► [External APIs] ──► [Processed Result]
                        │               │                      │
                        ▼               ▼                      ▼
                  [Gemini AI]     [Vision API]         [Final Response]
                                [Translation API]

Real-time Communication:
───────────────────────

[User A] ──► [Socket.io Client] ──► [Socket.io Server] ──► [Redis Store]
                                           │
[User B] ◄── [Socket.io Client] ◄─────────┘
```

### Component Architecture

```
Frontend Components:
───────────────────
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Authentication │    │    Dashboard    │    │     Library     │
│   Components    │    │   Components    │    │   Components    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Classes     │    │      Chat       │    │      Admin      │
│   Components    │    │   Components    │    │   Components    │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Backend Services:
────────────────
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Service   │    │ Library Service │    │  Class Service  │
│ • Login/Logout  │    │ • Seat Booking  │    │ • Enrollment    │
│ • Registration  │    │ • Resource Mgmt │    │ • Batch Mgmt    │
│ • OAuth         │    │ • Payment Proc  │    │ • Progress      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Chat Service   │    │   AI Service    │    │ Payment Service │
│ • Messaging     │    │ • Chatbot       │    │ • Razorpay      │
│ • Notifications │    │ • Vision        │    │ • Invoicing     │
│ • Real-time     │    │ • Translation   │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Database Models:
───────────────
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Model    │    │  Library Model  │    │   Class Model   │
│ • Profile Data  │    │ • Student Info  │    │ • Course Data   │
│ • Authentication│    │ • Seat Bookings │    │ • Enrollments   │
│ • Permissions   │    │ • Resources     │    │ • Faculty       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chat Model    │    │ Booking Model   │    │  Event Model    │
│ • Messages      │    │ • Monthly Data  │    │ • System Logs   │
│ • Participants  │    │ • Payment Info  │    │ • User Actions  │
│ • Timestamps    │    │ • Seat Status   │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Deployment Architecture

```
Production Environment:
──────────────────────

┌─────────────────────────────────────────────────────────────┐
│                      CLOUD INFRASTRUCTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Vercel    │    │  Railway/   │    │  MongoDB    │     │
│  │ (Frontend)  │    │   Heroku    │    │   Atlas     │     │
│  │             │    │ (Backend)   │    │ (Database)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Cloudinary  │    │   Redis     │    │   GitHub    │     │
│  │  (Media)    │    │  (Sessions) │    │  (Source)   │     │
│  │             │    │             │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Material-UI** - Enterprise-grade component library
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Framer Motion** - Animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time engine
- **Passport.js** - Authentication middleware
- **Mongoose** - MongoDB ODM
- **Redis** - Session store and caching
- **Multer** - File upload handling

### Database
- **MongoDB** - Primary database
- **Redis** - Session storage and caching

### External Services
- **Cloudinary** - Media storage and optimization
- **Google AI Platform** - Gemini, Vision, Translation APIs
- **Razorpay** - Payment processing
- **Gmail SMTP** - Email service

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Railway/Heroku** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **GitHub Actions** - CI/CD pipeline

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis server
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Shashankpantiitbhilai/EduGainer-s.git
cd EduGainer-s
```

2. **Install Backend Dependencies**
```bash
cd Backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../Frontend
npm install
```

4. **Set up Environment Variables**

Create `.env` files in both Backend and Frontend directories:

**Backend/.env**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/edugainers

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Authentication
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google AI Services
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account.json

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Razorpay
KEY_ID_RZRPAY=your_razorpay_key_id
KEY_SECRET_RZRPAY=your_razorpay_key_secret

# Email
EMAIL=your_gmail_address
PASSWORD=your_gmail_app_password

# Admin Credentials
ADMIN_EMAIL=admin@edugainers.com
ADMIN_PASSWORD=your_admin_password

# Environment URLs
FRONTEND_DEV=http://localhost:3000
FRONTEND_PROD=https://your-frontend-domain.com
BACKEND_DEV=http://localhost:8000
BACKEND_PROD=https://your-backend-domain.com
```

**Frontend/.env**
```env
REACT_APP_BACKEND_DEV=http://localhost:8000
REACT_APP_BACKEND_PROD=https://your-backend-domain.com
```

5. **Start the Development Servers**

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
cd Frontend
npm start
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

---

## 🔧 Configuration

### Database Setup

The application uses MongoDB with dynamic collection creation for monthly data:

```javascript
// Monthly booking collections are created automatically
const getModelForMonth = (month) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const collectionName = `${monthNames[month - 1]}`;
  return mongoose.model(collectionName, bookingSchema);
};
```

### Redis Configuration

Redis is used for session storage and OTP management:

```javascript
const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});
```

### AI Services Setup

Configure Google AI services for the chatbot:

1. Create a Google Cloud Project
2. Enable Vision, Translation, and Text-to-Speech APIs
3. Create a service account and download the JSON key
4. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable

---

## 🎯 Usage

### For Students

1. **Registration**: Sign up with email or Google account
2. **Library Access**: Book seats, browse resources
3. **Class Enrollment**: Register for available courses
4. **AI Assistant**: Get help with platform navigation
5. **Communication**: Chat with admins and peers

### For Administrators

1. **Dashboard Access**: Comprehensive admin panel
2. **User Management**: Add, edit, delete user accounts
3. **Resource Management**: Upload and organize library materials
4. **Analytics**: View platform usage statistics
5. **Communication**: Broadcast announcements

### For Developers

1. **API Integration**: RESTful APIs for all features
2. **Custom Themes**: Material-UI theming system
3. **Plugin Development**: Modular architecture for extensions
4. **Database Migrations**: Automated schema updates

---

## 📊 Database Schema

### Core Models

### Database Entity Relationships

```
                       ┌─────────────────┐
                       │      User       │
                       │ _id: ObjectId   │
                       │ username: String│
                       │ strategy: String│
                       │ role: String    │
                       │ permissions: [] │
                       │ faceAuth: Bool  │
                       │ timestamps: Date│
                       └─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │   LibStudent    │ │   ClassReg      │ │    Message      │
    │ userId: Ref     │ │ userId: Ref     │ │ messages: []    │
    │ name: String    │ │ name: String    │ │ sender: String  │
    │ reg: String     │ │ reg: String     │ │ content: String │
    │ email: String   │ │ amount: Number  │ │ timestamp: Date │
    │ amount: Number  │ │ class: String   │ │ roomId: String  │
    │ shift: String   │ │ payment: Object │ │ type: String    │
    │ image: Object   │ └─────────────────┘ └─────────────────┘
    │ payment: Object │           │
    └─────────────────┘           │
              │                   │
              ▼                   ▼
    ┌─────────────────┐ ┌─────────────────┐
    │ MonthlyBooking  │ │   AdminClass    │
    │ userId: Ref     │ │ name: String    │
    │ reg: String     │ │ faculty: String │
    │ name: String    │ │ amount: Number  │
    │ seat: String    │ │ contents: []    │
    │ status: String  │ │ image: Object   │
    │ totalMoney: Num │ │ studentIds: []  │
    │ colors: Map     │ └─────────────────┘
    └─────────────────┘

Additional Models:
──────────────────

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│     Events      │ │   EventLogs     │ │     Budget      │
│ name: String    │ │ action: String  │ │ _id: ObjectId   │
│ description: [] │ │ userId: Ref     │ │ month: Object   │
│ startDate: Date │ │ timestamp: Date │ │ income: Number  │
│ endDate: Date   │ │ details: Object │ │ expense: Number │
│ venue: String   │ │ module: String  │ │ profit: Number  │
│ capacity: Number│ │ severity: String│ │ year: Number    │
└─────────────────┘ └─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ ColorLegend     │ │    Traffic      │ │      Face       │
│ _id: ObjectId   │ │ _id: ObjectId   │ │ _id: ObjectId   │
│ colorCode: Map  │ │ date: Date      │ │ userId: Ref     │
│ status: String  │ │ visitors: Number│ │ faceData: Buffer│
│ description: [] │ │ pageViews: Num  │ │ encoding: []    │
│ isActive: Bool  │ │ uniqueUsers: Num│ │ isActive: Bool  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Schema Relationships

```
User Model Relationships:
─────────────────────────
User (1) ──── (Many) LibStudent     : User can have multiple library registrations
User (1) ──── (Many) ClassReg       : User can enroll in multiple classes  
User (1) ──── (Many) Message        : User can send multiple messages
User (1) ──── (One)  Face           : User can have face authentication data

LibStudent Relationships:
─────────────────────────
LibStudent (1) ──── (Many) MonthlyBooking : Student can have multiple monthly bookings

Class Relationships:
───────────────────
AdminClass (1) ──── (Many) ClassReg : Class can have multiple student registrations

Logging & Analytics:
───────────────────
EventLogs    : Track all user actions and system events
Traffic      : Monitor website analytics and visitor statistics
Budget       : Financial tracking for monthly income/expenses
ColorLegend  : Seat status color coding system
        ObjectId user
        Date timestamp
    }
```

### Dynamic Collections

The system creates separate collections for each month's bookings:
- `January`, `February`, `March`, etc.
- Automated by cron jobs at month-end
- Maintains historical data integrity

---

## 🤖 AI Integration

### Chatbot Features

```javascript
// Multilingual AI responses
const fetchGeminiTextResponse = async (input, { sessionHistory, language }) => {
  // AI classification and response generation
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  // Context-aware responses
  return { responseText, followUpQuestions, link };
};
```

### Vision API Integration

- **Document Analysis**: PDF and image content extraction
- **Face Recognition**: Authentication and verification
- **Optical Character Recognition**: Text extraction from images

### Translation Services

- **Real-time Translation**: English ↔ Hindi
- **UI Localization**: Dynamic language switching
- **Content Translation**: All user-generated content

---

## 🔐 Security Features

### Authentication & Authorization

- **Multi-factor Authentication**: Email OTP + Password
- **OAuth Integration**: Google Sign-In
- **Role-based Access Control**: Hierarchical permissions
- **Session Management**: Secure Redis-based sessions

### Data Protection

- **Input Validation**: Comprehensive data sanitization
- **File Upload Security**: Type and size restrictions
- **CORS Protection**: Environment-specific origins
- **Rate Limiting**: API request throttling

### Privacy Compliance

- **Data Encryption**: At-rest and in-transit
- **GDPR Compliance**: Right to deletion and portability
- **Audit Logging**: Comprehensive activity tracking

---

## 📱 API Documentation

### Authentication Endpoints

```javascript
POST   /auth/register           // User registration
POST   /auth/otp-verify        // OTP verification
POST   /auth/login             // User login
POST   /auth/logout            // User logout
POST   /auth/forgot-password   // Password reset
GET    /auth/google            // Google OAuth
```

### Library Management

```javascript
GET    /library/getSeatStatus          // Current seat availability
POST   /library/sendFeeData           // Submit payment data
GET    /library/getStudentLibSeat/:id  // Student seat information
PATCH  /library/updateMonthlyStatus   // Update booking status
```

### Admin Operations

```javascript
GET    /admin/fetchAllUsers           // Get all users
POST   /admin/addStudentData         // Add new student
PATCH  /admin/editLibStudent/:id     // Edit student data
DELETE /admin/deleteLibStudent/:id   // Delete student
POST   /admin/uploadResource        // Upload library resource
```

### AI Services

```javascript
POST   /gemini/chatbot/:language/:soundMode  // AI chat
POST   /gemini/chatbot/file                 // File analysis
POST   /vision/analyze                      // Image analysis
POST   /translate/text                      // Text translation
```

### Real-time Events

```javascript
// Socket.io events
socket.emit('joinRoom', roomId)
socket.emit('sendMessage', messageData)
socket.emit('updateSeatStatus', data)
socket.on('receiveMessage', handler)
socket.on('seatStatusUpdate', handler)
```

---

## 🎨 UI Components

### Design System

The application follows Material Design principles with custom theming:

```javascript
// Theme configuration
const lightTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
});
```

### Component Library

- **Forms**: React Hook Form with validation
- **Tables**: DataGrid with sorting and filtering
- **Navigation**: Responsive drawer and app bar
- **Dialogs**: Modal forms and confirmations
- **Charts**: Recharts for analytics visualization

### Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Appropriate touch targets
- **Accessibility**: WCAG 2.1 compliant
- **Progressive Web App**: Offline capabilities

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Commits**: Use conventional commit messages
- **Testing**: Write tests for new features
- **Documentation**: Update README and inline docs

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **New Features**: Implement requested features
- 📚 **Documentation**: Improve docs and tutorials
- 🌍 **Localization**: Add new language support
- 🎨 **UI/UX**: Design improvements
- ⚡ **Performance**: Optimization improvements

### Community Guidelines

- Be respectful and inclusive
- Follow the code of conduct
- Help others learn and grow
- Provide constructive feedback

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 EduGainer's

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👥 Community

### Connect with Us

- **Website**: [edugainers.com](https://edugainers-shashankpantiitbhilais-projects.vercel.app)
- **Email**: contact@edugainers.com
- **GitHub**: [EduGainer's Repository](https://github.com/Shashankpantiitbhilai/EduGainer-s)
- **Issues**: [Report Bugs](https://github.com/Shashankpantiitbhilai/EduGainer-s/issues)
- **Discussions**: [Community Forum](https://github.com/Shashankpantiitbhilai/EduGainer-s/discussions)

### Support the Project

If you find EduGainer's helpful, please consider:

- ⭐ **Star the repository**
- 🐛 **Report bugs and issues**
- 💡 **Suggest new features**
- 📖 **Improve documentation**
- 💬 **Spread the word**

### Roadmap

- [ ] **Mobile App**: React Native application
- [ ] **Advanced Analytics**: ML-powered insights
- [ ] **Multi-tenant**: Support for multiple institutions
- [ ] **API Gateway**: Microservices architecture
- [ ] **Blockchain**: Certificate verification
- [ ] **AR/VR**: Immersive learning experiences

---
20+x/32+x=3/4
80-4x=96-3x
x=16
52+2x
<div align="center">

**Built with ❤️ by the EduGainer's Team**

*Making quality education management accessible to everyone*

[⬆ Back to Top](#-edugainers---open-source-educational-management-platform)

</div>
