# 🎥 SUST CCTV — Campus CCTV Admin Client

> Modern, scalable admin client for campus CCTV surveillance management

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Elegant, pragmatic admin client for a campus CCTV system. Built with Next.js (App Router), React 19, Tailwind CSS, Zod + react-hook-form, and RTK Query for seamless API interactions.

This README provides: quick setup, architecture notes, RTK Query conventions, route map, API examples, deployment guide, troubleshooting tips, and author details — all crafted to make onboarding fast and maintenance predictable.

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Routes & Pages](#-routes--pages)
- [Environment Variables](#-environment-variables)
- [Author](#-author)

---

## ✨ Features

- **📊 Real-time Dashboard**: Monitor camera statuses, zone distribution, and system overview
- **📹 Camera Management**: Complete CRUD operations for CCTV cameras with location tracking
- **🗺️ Zone Management**: Organize cameras by geographic zones or campus areas
- **👥 User Management**: Role-based access control (Admin/User) with comprehensive user administration
- **🔐 Authentication & Security**: Secure login, profile management, and password change functionality
- **📱 Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **🎨 Dark/Light Mode**: Theme switching support via next-themes
- **🔄 Optimistic Updates**: RTK Query automatic cache invalidation and refetching
- **📝 Form Validation**: Robust client-side validation using Zod schemas
- **🚀 Performance**: Server components, code splitting, and optimized bundle size

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher (recommended: 20.x)
- **Package Manager**: npm, pnpm, or yarn
- **Backend API**: Running instance of the SUST CCTV backend server

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/md-rejoyan-islam/sust_cctv_client.git
cd sust_cctv_client
```

2. **Install dependencies**

```bash
npm install
# or with pnpm
pnpm install
# or with yarn
yarn install
```

3. **Set up environment variables** (optional)

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Run the development server**

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at `http://localhost:5506`

5. **Build for production**

```bash
npm run build
npm run start
```

---

## 🛠 Technology Stack

### Core Framework

### Core Framework

- **Next.js 16** - React framework with App Router for modern web applications
- **React 19.2** - Latest React with concurrent features and server components
- **TypeScript 5.x** - Static typing for enhanced developer experience

### State Management & Data Fetching

- **Redux Toolkit** - Predictable state container
- **RTK Query** - Powerful data fetching and caching
- **React Redux** - Official React bindings for Redux

### UI & Styling

- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (Dialog, Select, Dropdown, etc.)
- **Lucide Icons** - Beautiful & consistent icon set
- **next-themes** - Dark/light mode theming
- **Sonner** - Toast notifications

### Forms & Validation

- **react-hook-form** - Performant, flexible forms
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolver for react-hook-form

### Development Tools

- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **Tailwind Animate** - Animation utilities

---

## 📁 Project Structure

```
cctv-client/
├── app/                          # Next.js App Router
│   ├── (with-layout)/           # Authenticated pages with layout
│   │   ├── page.tsx            # Dashboard (/)
│   │   ├── cameras/
│   │   │   ├── page.tsx        # Cameras list
│   │   │   └── [id]/page.tsx   # Camera details
│   │   ├── zones/
│   │   │   ├── page.tsx        # Zones list
│   │   │   └── [id]/page.tsx   # Zone details
│   │   ├── users/
│   │   │   └── page.tsx        # User management
│   │   ├── profile/
│   │   │   └── page.tsx        # User profile
│   │   └── layout.tsx          # Main layout wrapper
│   ├── (without-layout)/
│   │   └── login/
│   │       └── page.tsx        # Login page
│   ├── api/
│   │   └── proxy/
│   │       └── [...path]/route.ts  # API proxy route
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   └── not-found.tsx           # 404 page
│
├── components/
│   ├── dialogs/                # Modal dialogs
│   │   ├── user-dialog.tsx
│   │   ├── add-camera-dialog.tsx
│   │   ├── zone-dialog.tsx
│   │   ├── password-change-dialog.tsx
│   │   └── delete-confirmation-dialog.tsx
│   ├── form/                   # Form components
│   │   └── login-form.tsx
│   ├── layout/                 # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   └── main-layout.tsx
│   ├── ui/                     # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ... (more components)
│   ├── cameras.tsx             # Camera management component
│   ├── users.tsx               # User management component
│   ├── zone.tsx                # Zone management component
│   ├── profile.tsx             # Profile component
│   ├── dashboard-client.tsx    # Dashboard client component
│   ├── providers.tsx           # Redux provider wrapper
│   └── theme-provider.tsx      # Theme provider
│
├── lib/
│   ├── api/                    # RTK Query API definitions
│   │   ├── auth.ts            # Authentication API
│   │   ├── users.ts           # Users API
│   │   ├── cameras.ts         # Cameras API
│   │   ├── zones.ts           # Zones API
│   │   └── base-query.ts      # Shared base query config
│   ├── store.ts               # Redux store configuration
│   ├── types.ts               # TypeScript type definitions
│   ├── validation.ts          # Zod validation schemas
│   └── utils.ts               # Utility functions
│
├── public/                     # Static assets
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## 🔄 RTK Query Conventions

#### Authentication API (`lib/api/auth.ts`)

- `useLoginMutation()` - User login
- `useLogoutMutation()` - User logout
- `useGetProfileQuery()` - Get current user profile
- `useUpdateProfileMutation()` - Update user profile
- `useChangePasswordMutation()` - Change user password
- `useRefreshTokenMutation()` - Refresh access token

#### Users API (`lib/api/users.ts`)

- `useGetUsersQuery(params)` - List users with pagination
- `useGetUserByIdQuery(id)` - Get single user
- `useAddUserMutation()` - Create new user
- `useUpdateUserMutation()` - Update existing user
- `useDeleteUserMutation()` - Delete user
- `useUserChangePasswordMutation()` - Admin password change

#### Cameras API (`lib/api/cameras.ts`)

- `useGetCamerasQuery(params)` - List cameras with filters
- `useGetCameraByIdQuery(id)` - Get camera details
- `useGetCameraHistoryQuery(id)` - Get camera status history
- `useAddCameraMutation()` - Add new camera
- `useUpdateCameraMutation()` - Update camera
- `useDeleteCameraMutation()` - Delete camera
- `useCamaraStatQuery()` - Get camera statistics

#### Zones API (`lib/api/zones.ts`)

- `useGetZonesQuery(params)` - List zones with pagination
- `useGetZoneByIdQuery(id)` - Get zone with cameras
- `useAddZoneMutation()` - Create new zone
- `useUpdateZoneMutation()` - Update zone
- `useDeleteZoneMutation()` - Delete zone

## 🗺️ Routes & Pages

### Public Routes

| Route    | Component                             | Description         |
| -------- | ------------------------------------- | ------------------- |
| `/login` | `app/(without-layout)/login/page.tsx` | User authentication |

### Protected Routes (Requires Authentication)

| Route           | Component                                 | Description                   |
| --------------- | ----------------------------------------- | ----------------------------- |
| `/`             | `app/(with-layout)/page.tsx`              | Dashboard with overview stats |
| `/cameras`      | `app/(with-layout)/cameras/page.tsx`      | Camera management list        |
| `/cameras/[id]` | `app/(with-layout)/cameras/[id]/page.tsx` | Camera details & history      |
| `/zones`        | `app/(with-layout)/zones/page.tsx`        | Zone management list          |
| `/zones/[id]`   | `app/(with-layout)/zones/[id]/page.tsx`   | Zone details with cameras     |
| `/users`        | `app/(with-layout)/users/page.tsx`        | User management (Admin only)  |
| `/profile`      | `app/(with-layout)/profile/page.tsx`      | User profile & settings       |

### API Routes

| Route                  | Handler                            | Description          |
| ---------------------- | ---------------------------------- | -------------------- |
| `/api/proxy/[...path]` | `app/api/proxy/[...path]/route.ts` | Proxy to backend API |

---

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Analytics, monitoring, etc.
# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

**Note**: The app uses a proxy route (`/api/proxy`) so frontend doesn't need to know the backend URL in most cases.

---

## 👤 Author

**Md Rejoyan Islam**

- GitHub: [@md-rejoyan-islam](https://github.com/md-rejoyan-islam)
- Project: [sust_cctv_client](https://github.com/md-rejoyan-islam/sust_cctv_client)

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

Made with ❤️ by [Md Rejoyan Islam](https://github.com/md-rejoyan-islam)
