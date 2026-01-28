# Laxmi Bakery Frontend

The frontend application for Laxmi Bakery built with React, TypeScript, and Material-UI.

## Features

- 🎨 Modern and responsive Material-UI design
- 📱 Mobile-first approach
- 🛍️ Product catalog with category filtering
- 🔍 Product search functionality
- 🛒 Product management for admins
- 🖼️ Image upload and management
- 🏷️ Tag-based product organization

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API service functions
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── config/        # Configuration files
├── store/         # State management
└── assets/        # Static assets
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory with:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Key Dependencies

- **React 18**: Modern UI library
- **TypeScript**: Type safety and better developer experience
- **Material-UI**: Component library for consistent design
- **Axios**: HTTP client for API requests
- **React Router**: Client-side routing

## Development Guidelines

1. **Code Style**
   - Use TypeScript for all new components
   - Follow Material-UI best practices
   - Implement responsive design
   - Add proper comments for complex logic

2. **Component Structure**
   - Keep components focused and reusable
   - Use proper type definitions
   - Implement error handling
   - Add loading states

3. **State Management**
   - Use React hooks for local state
   - Implement proper form validation
   - Handle API errors gracefully

4. **Testing**
   - Write unit tests for utilities
   - Test component rendering
   - Verify API integration

## Available Scripts

- `npm start`: Start development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the code style guidelines
2. Write meaningful commit messages
3. Add proper documentation
4. Test your changes thoroughly

## Troubleshooting

Common issues and solutions:

1. **API Connection Issues**
   - Verify API URL in `.env`
   - Check if backend is running
   - Verify network connectivity

2. **Build Issues**
   - Clear `node_modules` and reinstall
   - Update dependencies
   - Check for TypeScript errors
