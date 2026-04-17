# Mineral Explorer

The Mineral Explorer is a web application designed to showcase various minerals and geological zones for the Ministry of Mines. It provides an interactive way to explore resources across different geographic regions.

## Features

- **Interactive Maps**: Explore geological zones (North, South, East, West, North-East).
- **Mineral Database**: Detailed information on metallic minerals, industrial minerals, gemstones, and more.
- **Guest Access**: Public visitors can view all zones and resource details without logging in.
- **Admin Dashboard**: Secure interface for staff and administrators to manage zones and resources.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 15 (via Knex.js and Objection.js)
- **Frontend**: Nginx (Reverse Proxy & Static Asset Serving)
- **Containerization**: Docker & Docker Compose
- **Authentication**: Passport.js with Local Strategy
- **Templating**: EJS with EJS-Mate
- **Styling**: Bootstrap 5, Custom CSS

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Minster-of-Mining-and-Minerals/ministry-of-mines-Expo.git
    cd ministry_of_mines_expo
    ```

2.  **Setup Environment Variables**:
    Copy the example environment file and update the values as needed:
    ```bash
    cp .env.example .env
    ```

3.  **Build and Start the Application**:
    ```bash
    docker compose up --build -d
    ```

### Database Initialization

To initialize the PostgreSQL database and populate it with default data:

# 1. Rollback all migrations (deletes all tables)
docker compose exec backend npm run migrate:rollback

# 2. Re-apply all migrations (creates fresh tables)
docker compose exec backend npm run migrate

# 3. Seed the new tables
docker compose exec backend npm run seed:run

## Running the Application

Once the containers are built and running, the application will be available at:
`http://localhost:3003`

## Authentication

The application provides different access levels. All default accounts use their **username as the password**.

- **Admin Account**: `admin` / `admin`
- **Staff Account**: `staff` / `staff`
- **Guest Access**: No login required to browse zone and resource information.

### Administrative Tasks
Login to the admin dashboard to:
- Add or edit geological zones.
- Upload and manage mineral/resource entries.
- Register new users or staff members.

## Project Structure

- `index.js`: Main entry point and server configuration (listens on port 4003).
- `docker-compose.yml`: Orchestrates backend, database, and frontend containers.
- `Dockerfile.backend`: Build configuration for the Node.js service.
- `nginx.conf`: Nginx configuration for proxying and static serving.
- `routes/`: Express routers for authentication, zones, and resources.
- `db/`: Database configuration, migrations, seeds, and models.
- `views/`: EJS templates for the frontend.
- `public/`: Static assets (images, stylesheets, scripts).

## License

ISC License - see the [package.json](package.json) for details.
