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
   ```bash
   npm install
   npm run setup
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9000
