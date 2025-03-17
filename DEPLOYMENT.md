# Deployment Guide

## Backend Configuration

The backend Flask server has been configured to handle client-side routing properly. Any requests to paths that don't match static files or API endpoints will return the main `index.html` file, allowing React Router to handle the routing.

## Using Ngrok for Exposing Your Application

When using ngrok to expose your application, follow these steps to ensure proper routing:

1. First, build your React application:
   ```bash
   npm run build
   ```

2. Start your Flask backend server:
   ```bash
   cd backend
   python app.py
   ```

3. Expose your application using ngrok:
   ```bash
   ngrok http 5000
   ```

4. Update the `config.js` file with your new ngrok URL:
   ```javascript
   window.APP_CONFIG = {
     API_BASE_URL: 'https://your-ngrok-url.ngrok-free.app/api'
   }
   ```

## Server Deployment

When deploying to a production server:

### Using Nginx

If you're using Nginx to serve your application, add this configuration to handle client-side routing:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/your/app/dist;
    index index.html;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Using Apache

If using Apache, create a `.htaccess` file in your application's root directory:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Important Note

Always ensure that your server is configured to serve the main `index.html` file for all routes that don't correspond to actual files or API endpoints. This is crucial for single-page applications to work correctly with page refreshes and direct URL access. 