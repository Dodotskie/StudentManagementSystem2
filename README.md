# How to Run the System

## Requirements

- Node.js
- PHP
- Composer

## 1. Start the Backend (OPTIONAL ONLY)

Open a terminal and run:

```powershell
cd backend
php ..\composer.phar install
if (!(Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
php artisan migrate
php artisan serve
```

Keep this terminal open. The backend runs at `http://localhost:8000`.

## 2. Start the Frontend

Open another terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.



"# StudentManagementSystem" 
