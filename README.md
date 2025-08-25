# BHS Sports Hub 🏃‍♂️⚽🏉

A modern, comprehensive sports management platform for Barrow Hills School with a powerful admin backend for easy content management.

## ✨ Features

### 🎯 Core Functionality
- **Match Results Management** - Comprehensive match tracking and statistics
- **Team Statistics** - Performance analytics with charts and insights
- **Teacher Statistics** - Coaching performance metrics
- **Team Sheets** - Team lineups and match management
- **Kit Marks System** - Equipment and kit tracking
- **PE Groups** - Physical education management
- **Swimming & Athletics Records** - Individual and school record tracking
- **Photo Upload** - Camera integration with cloud storage

### 🛠️ Admin Features
- **Content Management** - Add/edit/delete teams, sports, and results
- **User Management** - Role-based access control
- **Real-time Updates** - Live data synchronization
- **Bulk Operations** - Efficient data management
- **Export Capabilities** - PDF and data export options

### 📱 Technical Features
- **Progressive Web App (PWA)** - Install on mobile devices
- **Responsive Design** - Works perfectly on all screen sizes
- **Real-time Database** - Supabase backend with live updates
- **Modern UI/UX** - Beautiful interface with Tailwind CSS
- **Role-Based Security** - Secure access control

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bhs-sports-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
cp env.example .env
# Edit .env with your Supabase credentials
```

4. **Start development server**
```bash
npm start
```

Visit `http://localhost:3000` to see your app!

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script from `database-schema.sql` in your Supabase SQL Editor
3. Configure authentication and storage settings
4. Create your first admin user

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## 🏗️ Architecture

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations

### Backend
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Advanced data protection
- **Real-time subscriptions** - Live data updates
- **File storage** - Secure photo and document storage

### Key Components
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, etc.)
├── lib/                # Utility libraries and Supabase client
└── styles/             # Global styles and Tailwind config
```

## 🔐 Authentication & Security

### User Roles
- **Admin** - Full system access and management
- **Teacher** - Team and result management
- **Coach** - Match input and team sheets
- **Viewer** - Read-only access to public data

### Security Features
- Row Level Security (RLS) on all tables
- JWT-based authentication
- Secure API endpoints
- Input validation and sanitization
- Rate limiting and abuse protection

## 📊 Data Management

### Core Entities
- **Teams** - School sports teams with year groups
- **Sports** - Different sports and activities
- **Match Results** - Game outcomes and statistics
- **Students** - Individual student records
- **Kit Items** - Equipment and gear tracking
- **Photos** - Sports event documentation

### Admin Operations
- Create, read, update, delete (CRUD) operations
- Bulk import/export capabilities
- Data validation and integrity checks
- Audit logging for changes

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logos in `public/logo/`
- Modify school name and details
- Customize splash screens and icons

### Features
- Enable/disable modules
- Customize data fields
- Modify workflows and processes
- Add custom analytics and reports

## 📱 PWA Features

### Mobile Experience
- Install on home screen
- Offline capabilities
- Push notifications (coming soon)
- Native app-like experience

### Splash Screens
- Multiple device sizes supported
- iOS and Android optimized
- Branded startup experience

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Netlify** - Drag & drop deployment
- **Vercel** - Git-based deployment
- **GitHub Pages** - Free hosting
- **AWS S3** - Scalable cloud hosting

### Environment Configuration
- Set production Supabase credentials
- Configure custom domains
- Set up SSL certificates
- Enable CDN for performance

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Code Style
- ESLint configuration included
- Prettier formatting
- Consistent component structure
- TypeScript support (optional)

## 📈 Performance

### Optimization Features
- Code splitting and lazy loading
- Image optimization
- Efficient database queries
- Caching strategies
- Bundle size optimization

### Monitoring
- Supabase dashboard metrics
- Performance monitoring
- Error tracking
- User analytics

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Follow React best practices
- Use consistent naming conventions
- Add proper error handling
- Include appropriate comments
- Write meaningful commit messages

## 📚 Documentation

### Additional Resources
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [API Documentation](./docs/api.md) - Backend API reference
- [Component Library](./docs/components.md) - UI component guide
- [Database Schema](./docs/schema.md) - Database structure

### Support
- Check the troubleshooting section in SETUP_GUIDE.md
- Review Supabase documentation
- Check browser console for errors
- Verify environment configuration

## 📄 License

This project is developed for Barrow Hills School and is intended for educational use.

## 🙏 Acknowledgments

- **Supabase** - For the excellent backend platform
- **Tailwind CSS** - For the beautiful design system
- **React Team** - For the amazing frontend framework
- **Barrow Hills School** - For the opportunity to build this system

---

**Built with ❤️ for Barrow Hills School PE Department**

For questions or support, please contact your school administrator or refer to the setup guide.
