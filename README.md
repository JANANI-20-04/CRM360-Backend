\# CRM360 Backend



CRM360 is a web-based Customer Relationship Management (CRM) system built using the MERN stack. This repository contains the backend REST API responsible for authentication, customers, leads, tasks, and database operations.



\## Tech Stack



\- Node.js

\- Express.js

\- MongoDB Atlas

\- Mongoose

\- JWT Authentication

\- bcryptjs

\- CORS

\- dotenv



\## Features



\- User registration and login

\- JWT-based authentication

\- Protected API routes

\- Customer management

\- Lead management

\- Lead status and pipeline management

\- Lead conversion to customer

\- Task management

\- MongoDB database integration

\- Role-based user information



\## Project Structure



```text

CRM360-Backend/

│

├── middleware/

│   └── authMiddleware.js

│

├── models/

│   ├── Customer.js

│   ├── Lead.js

│   ├── Task.js

│   └── User.js

│

├── routes/

│   ├── authRoutes.js

│   ├── customerRoutes.js

│   ├── leadRoutes.js

│   └── taskRoutes.js

│

├── .env.example

├── .gitignore

├── package.json

├── package-lock.json

└── server.js

