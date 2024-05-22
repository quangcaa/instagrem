# Introduction

Welcome to **Threads**, a modern social networking platform designed to connect people and facilitate interactions. Our platform offers a variety of features that enable users to share their thoughts, images, and videos, follow friends, and join communities of interest.

- DOCUMENT: [threads-document](https://www.canva.com/design/DAGFFU20qtY/nStiFRQyJLotYuXfCDrxNg/edit?utm_content=DAGFFU20qtY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Features

- **User Profiles**: Create and customize your personal profile with photos, bio, and more.
- **News Feed**: Stay updated with the latest posts from friends and communities.
- **Messaging**: Send direct messages to friends and participate in group chats.
- **Notifications**: Get real-time updates on activities and interactions.

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io

### Prerequisites

- Node.js v20.8.0
- npm v10.1.0
- AWS S3
- Cloudinary
- Redis
- MongoDb Atlas
- Docker (for MySQL)

### Installing

1. Clone the repository
2. Install dependencies for the client-side with `npm install` in the `client/` directory
3. Install dependencies for the server-side with `npm install` in the `server/` directory
4. Create a `.env` file in both the `client/` and `server/` directories and fill in the necessary environment variables. Refer to `.env.example` in the `server/` directory for required variables.

### Running the application

To start the client-side application, run `npm run dev` in the `client/` directory.

To start the server-side application, run `npm run server` in the `server/` directory.

## Project Structure

The client-side application is structured as follows:

- `src/` contains the main application code.
- `src/components/` contains reusable components.
- `src/pages/` contains the different pages of the application.
- `src/utils/` contains utility functions.
- `src/hooks/` contains custom React hooks.
- `src/context/` contains React context providers.
- `src/atoms/` contains atoms for state management using Recoil.

The server-side application is structured as follows:

- `controllers/` contains the controllers for handling different routes.
- `routes/` contains the route definitions.
- `config/` contains configuration files.
- `middlewares/` contains middleware functions.
- `utils/` contains utility functions.
- `mysql_models/` and `mongo_models/` contain the database models.

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details