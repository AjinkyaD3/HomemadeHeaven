# HandmadeHeaven - Artisanal E-commerce Platform

HandmadeHeaven is a full-featured e-commerce platform specializing in handcrafted gifts and custom frames. Built with React, TypeScript, and Supabase, it provides a seamless shopping experience for customers and comprehensive management tools for administrators.

## Features

### Customer Features
- 🛍️ Browse and search products
- 🎨 Customize products with various options
- 🛒 Shopping cart management
- ❤️ Save favorite items
- 📦 Order tracking
- 👤 User account management
- 🏷️ Apply discount coupons
- 📱 Responsive design for all devices

### Admin Features
- 📊 Dashboard with analytics
- 📝 Product management
- 🗂️ Category management
- 🎫 Coupon management
- 📦 Order management
- 👥 Customer management
- 📈 Sales reports
- 🔍 Advanced filtering and search

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Forms**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/handmade-heaven.git
   cd handmade-heaven
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create a new Supabase project
2. Run the database migrations from the `supabase/migrations` folder
3. Set up the following tables:
   - profiles
   - products
   - categories
   - orders
   - order_items
   - addresses
   - coupons
   - product_favorites
   - product_variations
   - reviews

### Authentication Setup

1. Enable Email/Password authentication in Supabase
2. Configure email templates for:
   - Email verification
   - Password reset
   - Magic links (optional)

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── admin/         # Admin-specific components
│   ├── ui/            # Basic UI components
│   └── ...
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and configurations
├── pages/            # Page components
│   ├── admin/        # Admin pages
│   ├── auth/         # Authentication pages
│   ├── account/      # User account pages
│   └── checkout/     # Checkout process pages
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Key Components

### Authentication Flow

The application uses Supabase Authentication with email/password sign-up. The auth flow includes:

1. User registration
2. Email verification (optional)
3. Login
4. Password reset
5. Session management

### Shopping Cart

The cart system uses React Context for state management and local storage for persistence. Features include:

- Add/remove items
- Update quantities
- Apply discounts
- Calculate totals
- Save for later

### Admin Dashboard

The admin interface provides comprehensive tools for managing the store:

1. **Dashboard**
   - Sales overview
   - Recent orders
   - Customer statistics
   - Revenue charts

2. **Product Management**
   - Create/edit products
   - Manage variations
   - Set pricing
   - Control inventory

3. **Order Management**
   - View orders
   - Update status
   - Process refunds
   - Generate invoices

4. **Customer Management**
   - View customer details
   - Order history
   - Contact information
   - Account status

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Deployment Options

1. **Netlify**
   - Connect to Git repository
   - Set environment variables
   - Configure build settings

2. **Vercel**
   - Import from Git
   - Configure environment variables
   - Deploy

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Component Guidelines

1. **File Organization**
   - One component per file
   - Use index files for exports
   - Group related components

2. **Naming Conventions**
   - PascalCase for components
   - camelCase for functions
   - UPPERCASE for constants

3. **State Management**
   - Use hooks for local state
   - Context for global state
   - Props for component communication

### Testing

1. **Unit Tests**
   - Test components in isolation
   - Mock external dependencies
   - Test error cases

2. **Integration Tests**
   - Test component interactions
   - Test data flow
   - Test user journeys

## Security Considerations

1. **Authentication**
   - Secure password requirements
   - Rate limiting
   - Session management

2. **Data Protection**
   - Input validation
   - XSS prevention
   - CSRF protection

3. **API Security**
   - Row Level Security (RLS)
   - API rate limiting
   - Request validation

## Performance Optimization

1. **Code Splitting**
   - Lazy loading
   - Route-based splitting
   - Component-based splitting

2. **Image Optimization**
   - Responsive images
   - Lazy loading
   - Format optimization

3. **Caching**
   - API response caching
   - Static asset caching
   - State persistence

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Check environment variables
   - Verify Supabase credentials
   - Check network connectivity

2. **Authentication**
   - Clear browser cache
   - Check email configuration
   - Verify user permissions

3. **Build Issues**
   - Clear node_modules
   - Update dependencies
   - Check TypeScript errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.