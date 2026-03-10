# EduDisaster Frontend

React-based frontend application for disaster preparedness education built with Vite and TypeScript.

## Features

- **Multilingual Support**: English and regional language support
- **User Authentication**: Secure login and registration
- **Educational Content**: Interactive disaster preparedness modules
- **Dashboard Analytics**: Visual representation of preparedness metrics
- **Emergency Resources**: Quick access to emergency contacts and videos
- **Responsive Design**: Mobile-friendly interface
- **Real-time API Integration**: Connected to REST API backend

## Tech Stack

- **React 19**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tool
- **Recharts**: Data visualization library
- **Google Generative AI**: AI-powered assistance
- **Tailwind CSS**: Utility-first CSS framework

## Setup

### Prerequisites
- Node.js (v16 or higher)
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to http://localhost:5173

### Build for Production
```bash
npm run build
```

## Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000/api`. 

To change the API endpoint, update the `API_BASE_URL` in `services/apiService.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url:5000/api';
```

## Project Structure

```
frontend/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── locales/            # Internationalization files
├── auth/               # Authentication components
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend uses a centralized API service (`services/apiService.ts`) that provides:

- Authentication methods (login, register)
- Education content fetching
- Hazard data retrieval
- Dashboard metrics
- Emergency contacts
- Video resources

### Example Usage

```typescript
import { apiService } from './services/apiService';

// Login user
const login = async (username: string, password: string) => {
  try {
    const response = await apiService.login(username, password);
    localStorage.setItem('token', response.token);
    return response.user;
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Get education content
const getEducation = async () => {
  try {
    const content = await apiService.getEducationData('en', 'Earthquake');
    return content;
  } catch (error) {
    console.error('Failed to fetch education data:', error);
  }
};
```

## Components

### Key Components

- **Auth**: Login and registration forms
- **Dashboard**: Main dashboard with metrics and charts
- **Education**: Disaster preparedness educational modules
- **Emergency**: Emergency contacts and resources
- **Videos**: Educational video gallery

### Component Structure

Each component follows the pattern:
```typescript
interface ComponentProps {
  // Component props
}

const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // Component logic
  return (
    // JSX
  );
};

export default Component;
```

## State Management

The application uses React Context for global state management:

- **AuthContext**: User authentication state
- **ThemeContext**: Application theme settings

## Styling

The application uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

## Internationalization

Support for multiple languages is implemented through the `locales/` directory. Currently supports:
- English (en)
- Add more languages as needed

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Use semantic HTML elements

### API Calls
- Use the centralized `apiService`
- Implement proper error handling
- Show loading states during API calls
- Handle authentication tokens properly

### Component Best Practices
- Keep components small and focused
- Use props for data flow
- Use context for global state
- Implement proper TypeScript types
- Add meaningful comments

## Environment Variables

Create a `.env` file in the frontend root:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Deployment

### Build Process
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new components
3. Test your changes
4. Update documentation as needed

## License

MIT License
