# EduDisaster - Personalized Disaster Preparedness Platform

A comprehensive disaster preparedness education platform with separate frontend and backend architecture.

## Project Structure

```
sih_2025_edudisaster/
├── backend/                 # Node.js/Express REST API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── config/             # Database configuration
│   ├── scripts/            # Database seeding
│   ├── data/               # Initial data (JSON files)
│   └── server.js           # Main server file
├── frontend/               # React TypeScript application
│   ├── components/        # React components
│   ├── services/           # API service layer
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── locales/            # Internationalization
│   └── auth/               # Authentication components
└── README.md              # This file
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. Seed the database:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Features

- **Backend REST API**: Node.js, Express, MongoDB
- **Frontend SPA**: React 19, TypeScript, Vite
- **Authentication**: JWT-based user authentication
- **Education Content**: Multilingual disaster preparedness modules
- **Dashboard Analytics**: Real-time preparedness metrics
- **Emergency Resources**: Contacts and video resources
- **Security**: Rate limiting, CORS, helmet protection
- **Data Visualization**: Charts and analytics with Recharts

## API Documentation

See [backend/README.md](./backend/README.md) for detailed API documentation.

## Frontend Documentation

See [frontend/README.md](./frontend/README.md) for frontend development guide.

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcryptjs for password hashing
- Rate limiting and security middleware

### Frontend
- React 19 with TypeScript
- Vite for development and building
- Recharts for data visualization
- Google Generative AI integration
- Tailwind CSS for styling

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edudisaster
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Database Schema

The application uses MongoDB with the following collections:
- Users (authentication and roles)
- Education (multilingual disaster content)
- Hazards (state-wise hazard mapping)
- Dashboard (analytics and metrics)
- Contacts (emergency contacts)
- Videos (educational resources)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Implement proper error handling
4. Test your changes
5. Update documentation
6. exit

