# Mineral Explorer

The Mineral Explorer is a web application designed to showcase various minerals and geological zones for the Ministry of Mines. It provides an interactive way to explore resources across different geographic regions.

## Features

- **Interactive Maps**: Explore geological zones (North, South, East, West, North-East).
- **Mineral Database**: Detailed information on metallic minerals, industrial minerals, gemstones, and more.
- **Guest Access**: Public visitors can view all zones and resource details without logging in.
- **Admin Dashboard**: Secure interface for staff and administrators to manage zones and resources.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (via Knex.js and Objection.js)
- **Authentication**: Passport.js with Local Strategy
- **Templating**: EJS with EJS-Mate
- **Styling**: Bootstrap 5, Custom CSS

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (usually comes with Node.js)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd ministry_of_mines_expo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory (or update the existing one):
    ```env
    DB_CLIENT = sqlite3
    DB_FILE = ./db/dev.sqlite3
    SESSION_SECRET = your_secret_key
    SERVER_HOST = localhost
    ```

### Database Initialization

To create the SQLite database and populate it with default data:

1.  **Run Migrations**:
    ```bash
    node node_modules/knex/bin/cli.js --knexfile=./db/knexfile.js migrate:latest
    ```

2.  **Run Seeds**:
    ```bash
    node node_modules/knex/bin/cli.js --knexfile=./db/knexfile.js seed:run
    ```

## Running the Application

### Development Mode
```bash
node index.js
```
The application will be available at `http://localhost:3000`.

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

- `index.js`: Main entry point and server configuration.
- `routes/`: Express routers for authentication, zones, and resources.
- `db/`: Database configuration, migrations, seeds, and models.
- `views/`: EJS templates for the frontend.
- `public/`: Static assets (images, stylesheets, scripts).

## License

ISC License - see the [package.json](package.json) for details.
