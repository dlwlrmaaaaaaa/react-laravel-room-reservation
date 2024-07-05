# Room reservation

## Introduction
This project is a web application built using React for the frontend and Laravel for the backend. Follow the instructions below to set up and run the project on your local machine.

## Backend Configuration

### Step 1: Install Dependencies
1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Install the necessary dependencies:
    ```sh
    composer install
    ```

### Step 2: Environment Configuration
1. Copy the `.env.example` file to `.env`:
    ```sh
    cp .env.example .env
    ```
   If there is no `.env` file, create one manually.

2. Generate the application key:
    ```sh
    php artisan key:generate
    ```

3. Configure the database settings in the `.env` file:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=backend
    DB_USERNAME=root
    DB_PASSWORD=1234  # Change this to your MySQL password or leave it blank if you don't have a password
    ```

4. Configure the mail settings in the `.env` file:
    ```env
    MAIL_MAILER=smtp
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USERNAME="your email address"
    MAIL_PASSWORD="your app key"
    MAIL_ENCRYPTION=ssl
    MAIL_FROM_ADDRESS="this should be your email"
    MAIL_FROM_NAME="JM Staycation"
    ```

5. Add or modify the following settings in the `.env` file:
    ```env
    APP_URL=http://localhost:8000
    SANCTUM_STATEFUL_DOMAINS=localhost:5173
    FRONT_END_URL=http://localhost:5173
    SESSION_DOMAIN=localhost
    ```

### Step 3: Storage and Database Migration
1. Create a symbolic link to the storage directory:
    ```sh
    php artisan storage:link
    ```

2. Run the migrations:
    ```sh
    php artisan migrate
    ```

### Step 4: Serve the Application
1. Start the Laravel development server:
    ```sh
    php artisan serve
    ```

## Frontend Configuration

### Step 1: Install Dependencies
1. Navigate to the frontend directory:
    ```sh
    cd room-reservation/my-project
    ```

2. Install the necessary dependencies:
    ```sh
    npm install
    ```

### Step 2: Run the Development Server
1. Start the React development server:
    ```sh
    npm run dev
    ```
   Ensure that it is running on port 5173.

### Step 3: Access the Application
1. Open your browser and navigate to:
    ```sh
    http://localhost:5173
    ```

## Conclusion
By following these steps, you should be able to set up and run the project on your local machine. If you encounter any issues, please check the configuration settings and ensure that all dependencies are properly installed.

---

Feel free to modify this README to better suit your project's specific needs or to add any additional information that might be useful for developers working on the project.
