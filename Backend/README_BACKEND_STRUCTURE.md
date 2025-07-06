# EduGainer's Backend - Standardized Structure

## 📁 Directory Structure

```
Backend/
├── src/                          # Source code directory
│   ├── config/                   # Configuration files
│   │   ├── database.js          # MongoDB connection config
│   │   ├── cloudinary.js        # Cloudinary storage config
│   │   ├── redis.js             # Redis cache config
│   │   └── passport.js          # Passport authentication config
│   │
│   ├── controllers/             # Business logic controllers
│   │   ├── admin/               # Admin-specific controllers
│   │   ├── ai/                  # AI/ML related controllers
│   │   ├── classes/             # Classes management controllers
│   │   ├── Event/               # Event management controllers
│   │   ├── library/             # Library management controllers
│   │   ├── adminController.js   # Main admin controller
│   │   ├── authController.js    # Authentication controller
│   │   ├── classesController.js # Classes controller
│   │   ├── libraryController.js # Library controller
│   │   └── ...                  # Other controllers
│   │
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js             # Authentication middleware
│   │   ├── errorHandler.js     # Error handling middleware
│   │   ├── upload.js           # File upload middleware (multer)
│   │   └── validation.js       # Request validation middleware
│   │
│   ├── models/                  # Database models
│   │   ├── Admin.js            # Admin model
│   │   ├── budget.js           # Budget tracking model
│   │   ├── chat.js             # Chat messages model
│   │   ├── classes.js          # Classes model
│   │   ├── EventLogs.js        # Event logging model
│   │   ├── student.js          # Student/User models
│   │   └── ...                 # Other models
│   │
│   ├── routes/                  # API route definitions
│   │   ├── api/                # API versioning
│   │   │   ├── v1/             # Version 1 API routes
│   │   │   │   ├── auth.js     # Authentication routes
│   │   │   │   ├── admin.js    # Admin routes
│   │   │   │   ├── classes.js  # Classes routes
│   │   │   │   ├── library.js  # Library routes
│   │   │   │   ├── payment.js  # Payment routes
│   │   │   │   ├── chat.js     # Chat routes
│   │   │   │   └── ...         # Other route files
│   │   │   └── index.js        # API routes aggregator
│   │   └── index.js            # Main routes entry point
│   │
│   ├── services/               # Business logic services
│   │   ├── email/              # Email service
│   │   │   └── emailSender.js  # Email sending service
│   │   ├── payment/            # Payment services
│   │   │   └── razorpayService.js # Razorpay integration
│   │   ├── auth/               # Authentication services
│   │   └── ai/                 # AI/ML services
│   │
│   ├── utils/                  # Utility functions
│   │   ├── helpers.js          # Common helper functions
│   │   ├── constants.js        # Application constants
│   │   ├── validators.js       # Data validation utilities
│   │   └── logger.js           # Logging utilities
│   │
│   ├── jobs/                   # Background jobs and tasks
│   │   ├── cronJobs.js         # Scheduled cron jobs
│   │   └── triggers.js         # Database triggers
│   │
│   └── app.js                  # Express app configuration
│
├── uploads/                    # File upload directory
├── logs/                       # Application logs
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Lock file for dependencies
└── server.js                  # Application entry point
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payment Gateway
KEY_ID_RZRPAY=your_razorpay_key_id
KEY_SECRET_RZRPAY=your_razorpay_secret

# Cloud Storage
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

# Email
EMAIL=your_email@gmail.com
PASSWORD=your_email_password

# Frontend URLs
FRONTEND_PROD=https://your-production-frontend-url
FRONTEND_DEV=http://localhost:3000

# Backend URLs
BACKEND_PROD=https://your-production-backend-url
BACKEND_DEV=http://localhost:8000
```

## 📋 API Documentation

### Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://your-backend-url/api/v1`

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Admin Endpoints
- `GET /admin/fetchLibData` - Fetch library data
- `POST /admin/addStudentData` - Add student data
- `DELETE /admin/deleteLibStudent/:id` - Delete library student
- `PATCH /admin/editLibStudent/:id` - Edit library student

### Library Endpoints
- `GET /library/getSeatStatus` - Get seat availability
- `POST /library/verify-payment/:user_id` - Verify payment
- `GET /library/getStudentLibSeat/:id` - Get student seat info

### Classes Endpoints
- `GET /classes/getAllClasses` - Get all classes
- `POST /classes/create-order` - Create payment order
- `POST /classes/payment-verification/:user_id` - Verify payment

### Payment Endpoints
- `POST /payment/create-order` - Create Razorpay order
- `POST /payment/verify-signature` - Verify payment signature

## 🔧 Key Features

### 1. **Modular Architecture**
- Clean separation of concerns
- Organized folder structure
- Reusable components

### 2. **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control
- Google OAuth integration
- Session management

### 3. **Payment Integration**
- Razorpay payment gateway
- Secure payment verification
- Order management

### 4. **Real-time Features**
- Socket.IO for live chat
- Real-time seat status updates
- Live notifications

### 5. **File Management**
- Cloudinary integration
- Secure file uploads
- Image optimization

### 6. **Database Operations**
- MongoDB with Mongoose
- Dynamic collections for monthly data
- Data validation and schema enforcement

### 7. **Background Jobs**
- Automated monthly data migration
- Database change tracking
- Email notifications

### 8. **AI/ML Integration**
- Google Cloud APIs
- Translation services
- Text-to-speech functionality
- Vision API integration

## 🛠 Development Guidelines

### Code Structure
- Follow the established folder structure
- Use proper naming conventions
- Keep controllers thin, services fat
- Implement proper error handling

### API Development
- Use RESTful conventions
- Implement proper HTTP status codes
- Add request validation
- Include comprehensive error responses

### Database Operations
- Use Mongoose models consistently
- Implement proper indexing
- Handle database errors gracefully
- Use transactions where necessary

### Security
- Validate all inputs
- Use authentication middleware
- Implement rate limiting
- Secure sensitive data

## 📦 Dependencies

### Core Dependencies
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **socket.io**: Real-time communication
- **passport**: Authentication middleware
- **razorpay**: Payment gateway integration
- **cloudinary**: Cloud storage
- **redis**: Caching and session storage

### Development Dependencies
- **nodemon**: Development server
- **dotenv**: Environment variable management

## 🔄 Migration from Old Structure

The backend has been restructured to follow industry best practices:

1. **Moved configuration files** to `src/config/`
2. **Organized routes** with API versioning in `src/routes/api/v1/`
3. **Created service layer** in `src/services/`
4. **Added middleware** in `src/middleware/`
5. **Centralized utilities** in `src/utils/`
6. **Updated import paths** throughout the codebase

All existing functionality remains intact while providing better maintainability and scalability.

## 🚀 Deployment

### Production Checklist
- [ ] Set all environment variables
- [ ] Update database connection strings
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (if needed)
- [ ] Set up monitoring and logging
- [ ] Test all API endpoints
- [ ] Verify payment gateway integration

### Docker Support (Future Enhancement)
```dockerfile
# Dockerfile for containerized deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 📞 Support

For any issues or questions regarding the backend structure:
1. Check the logs in `/logs` directory
2. Verify environment variables
3. Check database connectivity
4. Review API documentation
5. Contact the development team

---

**Note**: This standardized structure maintains all existing functionality while providing better organization, maintainability, and scalability for future development.
