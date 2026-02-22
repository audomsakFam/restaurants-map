# Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm

### Setup Instructions

1. **Start the database**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies and setup**
   - Note: Please rename the `.env.example` file in backend directory to `.env` before proceeding. The `npm run setup` command will automatically initialize the Prisma database.

   ```bash
   npm install
   npm run setup
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9000

6. **Usage & Testing**
   - **Access the App:** Open your browser and go to `http://localhost:5173`.
   - **Test the Search Feature:** Use the search input box to find restaurants. You can test the local database search by using keywords and restaurant names found in the seed file located at `backend/prisma/seed.ts`.
  
### Frameworks used
- Frontend: React + Vite + Typescript + tailwindcss + react-leaflet
- Backend: Express.js + Typescript + Prisma 
- DB: Postgresql + Redis
- Infrastructure: Docker + Docker Compose

### Issues and Limitations.
- Google Places API: This project uses the Google Places API for external search. To search for restaurants outside of the provided seed data, you must add your own API key to the `.env` file.
