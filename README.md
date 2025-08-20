# 🛒 The Grocery List

<div align="center">

<div align="center">
  <img src="client/src/assets/shopping-cart-supermarket-svgrepo-com.svg" alt="Grocery List Logo" style="width: 33%; height: 33%;">
</div>

*A modern, full-stack grocery shopping management application*

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![.NET](https://img.shields.io/badge/.NET-8.0-purple?logo=dotnet)](https://dotnet.microsoft.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

[🚀 Live Demo](https://the-grocery-list.vercel.app) 

</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Usage](#usage)

## 🎯 About

The Grocery List organizes your shopping by store layout. Map your grocery store's aisles once, and your lists will automatically sort items in the order you'll encounter them while shopping. It's a straightforward solution to make grocery shopping faster and more organized.

### Key Highlights
- **Smart Store Layouts**: Create and customize your store's aisle layout for efficient shopping routes
- **User Authentication**: Secure JWT-based authentication system
- **Real-time Updates**: Instant synchronization across devices
- **Responsive Design**: Seamless experience on desktop and mobile devices
- **Persistent Storage**: Your data is safely stored and accessible anytime

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure account creation and login
- 🏪 **Store Layout Management** - Create custom store layouts with aisles
- 📝 **List Management** - Create, edit, and manage multiple grocery lists
- ✅ **Smart Item Tracking** - Add, categorize, and check off items
- 🎯 **Organized Shopping** - Items organized by store layout for efficient shopping
- 💾 **Persistent Storage** - All data safely stored in MongoDB
- 📱 **Responsive Design** - Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Chakra UI** - Modular and accessible component library
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Vite** - Fast build tool and development server
- **Vitest** - Unit testing framework

### Backend
- **.NET 8.0** - High-performance web API framework
- **C#** - Strongly typed programming language
- **MongoDB** - NoSQL document database
- **JWT Authentication** - Secure token-based authentication
- **BCrypt** - Password hashing
- **Swagger/OpenAPI** - API documentation

### DevOps & Tools
- **Vercel** - Frontend deployment and hosting
- **ESLint** - Code linting and formatting
- **xUnit** - Backend testing framework


## 📖 Usage

### Getting Started with the App

1. **Create an Account**
   - Navigate to the signup page
   - Enter your email and password
   - Verify your account (if email verification is enabled)

2. **Setup Your Store Layout**
   - Go to "Store Layouts" in the navigation
   - Click "Create New Layout"
   - Add aisles that match your grocery store's layout
   - Save your layout

3. **Create Your First Grocery List**
   - Navigate to "My Lists"
   - Click "Create New List"
   - Give your list a name
   - Select your store layout

4. **Add Items**
   - Click "Add Item" on your list
   - Enter the item name
   - Select the appropriate aisle
   - Add any notes or quantity

5. **Shop Efficiently**
   - Items are automatically organized by your store layout
   - Check off items as you shop
   - Items remain organized for optimal shopping flow
</div>