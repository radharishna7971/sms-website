// Set environmental variables in development environment.  Set by default in production
if (process.env.NODE_ENV === 'development') {
    process.env.PORT = 8000;
    process.env.DB_HOSTNAME = '127.0.0.1';
    process.env.DB_USERNAME = 'root';
    process.env.DB_PASSWORD = '';
    process.env.DB_PORT = 3306;
    process.env.DB_NAME = 'smstudios_db';
    process.env.CLIENT_FILES = "client";
}