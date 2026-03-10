# EduDisaster Backend API

REST API backend for the EduDisaster application built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based user authentication with registration and login
- **Education Content**: Multilingual disaster preparedness educational content
- **Hazard Mapping**: State-wise hazard information for India
- **Dashboard Analytics**: Preparedness scores and participation metrics
- **Emergency Contacts**: Important emergency contact numbers
- **Video Resources**: Educational videos categorized by disaster type
- **Security**: Rate limiting, CORS, helmet protection
- **Database**: MongoDB with Mongoose ODM

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users (admin)

### Education
- `GET /api/education` - Get all education content
- `GET /api/education/:disasterType` - Get content by disaster type
- `POST /api/education` - Create education content
- `PUT /api/education/:id` - Update education content
- `DELETE /api/education/:id` - Delete education content

### Hazards
- `GET /api/hazards` - Get all state hazards
- `GET /api/hazards/:state` - Get hazards by state
- `POST /api/hazards` - Create hazard data
- `PUT /api/hazards/:id` - Update hazard data
- `DELETE /api/hazards/:id` - Delete hazard data

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `PUT /api/dashboard` - Update dashboard data
- `POST /api/dashboard/reset` - Reset dashboard data

### Contacts
- `GET /api/contacts` - Get all emergency contacts
- `GET /api/contacts/:id` - Get contact by ID
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Videos
- `GET /api/videos` - Get all videos (with optional category filter)
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Create video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Health Check
- `GET /api/health` - API health status

## Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edudisaster
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Seed the database with initial data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

## Database Schema

### Users
```javascript
{
  username: String (required, unique),
  role: String (required, enum),
  password: String (required, hashed)
}
```

### Education
```javascript
{
  language: String (required),
  disasterType: String (required),
  content: {
    description: String,
    dos: [String],
    donts: [String]
  }
}
```

### Hazards
```javascript
{
  state: String (required, unique),
  hazards: [String]
}
```

### Dashboard
```javascript
{
  preparednessScore: Number,
  studentsTrained: Number,
  drillsCompleted: Number,
  participationByGrade: [{ name: String, participation: Number }],
  preparednessByDisaster: [{ subject: String, score: Number, fullMark: Number }]
}
```

### Contacts
```javascript
{
  name: String (required),
  number: String (required)
}
```

### Videos
```javascript
{
  title: String (required),
  description: String (required),
  thumbnail: String (required),
  url: String (required),
  category: String (required)
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for frontend access
- **Helmet**: Security headers protection
- **Input Validation**: Request validation and sanitization

## Development

### Running Tests
```bash
npm test
```

### Database Seeding
The initial data is seeded from JSON files in the `data/` directory:
- `users.json` - User accounts
- `education.json` - Educational content
- `hazards.json` - State-wise hazards
- `dashboard.json` - Dashboard metrics
- `contacts.json` - Emergency contacts
- `videos.json` - Video resources

To reseed the database:
```bash
npm run seed
```

## Deployment

### Environment Variables for Production
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/edudisaster
JWT_SECRET=strong_production_secret
NODE_ENV=production
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## API Documentation

The API follows RESTful conventions:
- GET: Retrieve resources
- POST: Create new resources
- PUT: Update existing resources
- DELETE: Remove resources

All responses are in JSON format with proper HTTP status codes.

## License

MIT License
