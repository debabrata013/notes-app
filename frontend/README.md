# AI Notes Frontend

A modern, responsive React application for intelligent note-taking with AI-powered features.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Secure session management
- Beautiful gradient UI with glassmorphism effects

### 📝 Note Management
- **Create Notes**: Rich text editor with category selection
- **Edit Notes**: In-place editing with real-time updates
- **Delete Notes**: Confirmation dialogs for safe deletion
- **View Notes**: Full-screen reading mode with metadata
- **Categories**: Organize notes by type (General, Work, Personal, Study, Meeting, Creative)

### 🔍 Advanced Search
- **Real-time Search**: Search by title and content
- **Smart Suggestions**: Auto-complete with context
- **Category Filtering**: Filter by note categories
- **Advanced Filters**: Date range and search scope options
- **Search Highlighting**: Visual feedback for search results

### 🤖 AI-Powered Features
- **AI Note Generation**: Create notes from prompts
- **Multiple Note Types**: 
  - General notes
  - Summaries with key points
  - Study notes with definitions
  - Meeting notes with agendas
  - Creative content
- **Auto Title Generation**: AI-generated titles
- **Note Improvement**: Enhance existing notes with AI
- **Smart Categorization**: AI-suggested categories

### 📊 Dashboard & Analytics
- **Statistics Cards**: Total notes, AI-generated, favorites, weekly activity
- **Visual Indicators**: Progress tracking and usage metrics
- **Quick Actions**: Fast access to common operations

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI with purple/blue gradients
- **Grid/List Views**: Toggle between card and list layouts
- **Toast Notifications**: Real-time feedback for actions
- **Loading States**: Smooth loading animations
- **Keyboard Shortcuts**: Power user features

### 🔧 Technical Features
- **Real-time Updates**: Instant UI updates after operations
- **Optimistic Updates**: Immediate feedback before server response
- **Error Handling**: Comprehensive error management
- **Offline Support**: Basic offline functionality
- **Performance**: Optimized rendering and lazy loading

## Technology Stack

- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── NoteCard.jsx    # Individual note display
│   ├── NoteModal.jsx   # Create/Edit/View note modal
│   ├── AIModal.jsx     # AI note generation modal
│   ├── SearchBar.jsx   # Advanced search component
│   ├── StatsCard.jsx   # Dashboard statistics
│   └── Toast.jsx       # Notification system
├── pages/              # Main application pages
│   ├── Home.jsx        # Dashboard and note management
│   ├── Login.jsx       # User authentication
│   └── Register.jsx    # User registration
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state management
├── api/                # API integration
│   └── axiosInstance.js # Configured HTTP client
└── assets/             # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd froentend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

The frontend communicates with a Node.js/Express backend through:

- **Authentication**: `/api/auth/*`
- **Notes CRUD**: `/api/notes/*`
- **AI Features**: `/api/ai-notes/*`

All API calls are proxied through Vite for development.

## Component Documentation

### NoteCard
Displays individual notes in grid or list view with:
- Title and content preview
- Category badges
- AI-generated indicators
- Action buttons (view, edit, delete)
- Responsive design

### NoteModal
Multi-purpose modal for:
- Creating new notes
- Editing existing notes
- Viewing notes in full-screen
- Category selection
- Form validation

### AIModal
AI-powered note generation with:
- Prompt input
- Note type selection
- Suggestion system
- Auto-title generation
- Loading states

### SearchBar
Advanced search functionality:
- Real-time search
- Smart suggestions
- Category filtering
- Advanced options
- Search history

## Styling

The application uses a modern design system with:

- **Color Palette**: Dark theme with purple/blue gradients
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's scale
- **Animations**: Smooth transitions and micro-interactions
- **Glassmorphism**: Backdrop blur effects for modern look

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized assets
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Proper HTTP caching headers
- **Minification**: Production build optimization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments
