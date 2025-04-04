# RestaurantApp

RestaurantApp is a full-stack application that combines an ASP.NET Core Web API backend with a React frontend. It manages restaurant data including users, dishes, categories, orders, and carts. The project demonstrates a complete solution with authentication, data seeding (using Bogus Faker), and RESTful API endpoints documented via Swagger.

## Content

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
## Features

- **User Authentication:** Secure registration and login with JWT.
- **User Management:** CRUD operations for user data.
- **Dish & Category Management:** Manage dishes and dish categories.
- **Order & Cart Functionality:** Users can add items to their cart and complete an order.
- **Data Seeding:** Uses [Bogus](https://github.com/bchavez/Bogus) Faker to seed the database with realistic sample data.
- **Swagger UI:** Auto-generated API documentation for testing and integration.

## Tech Stack

- **Backend:** ASP.NET Core Web API, Entity Framework Core, SQL Server (or Azure SQL Database), JWT Authentication.
- **Frontend:** React, Vite, Axios.
- **Libraries:** Bogus for data generation, BCrypt.Net for password hashing, Swashbuckle for Swagger.

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS recommended)
- SQL Server or Azure SQL Database (update your connection string accordingly)

### Backend setup
- Navigate to the RestaurantAPI\RestaurantAPI folder.
- Run ``dotnet build`` to find possible errors
- When everything is ok, run ``dotnet run``
- API will be available at ``http://localhost:5218`` and Swagger UI at ``http://localhost:5218/swagger``.

### Frontend setup
- Navigate to the restaurant-client folder.
- Run ``npm install`` to check installed modifies
- Run ``npm run dev``
- The React application will launch (probably on http://localhost:5173 or a similar port).
