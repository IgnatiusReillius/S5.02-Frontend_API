## AI-generated frontend

AI-assisted frontend design to practice code generation and apply it to the backend of the previous REST API project.

## Features

- User registration and authentication
- Role-based access control, with admin and user roles
- Add personal reviews to your books
- Full CRUD for books, users and reviews 

## Prerequisites

Before cloning the project, ensure the following tools are installed:

- **[Git](https://git-scm.com/install/windows)**
- **[Composer](https://getcomposer.org/download/)**

You also need to have the [previous repository](https://github.com/IgnatiusReillius/S5.01-API_REST) cloned and working. 

Follow the instructions in that repository up to step 8, then continue from here.

Pay attention to the server address that the terminal returns when you perform step 8. You will use it later. 

In my case, it is:
```
   INFO  Server running on [http://127.0.0.1:8000].
```

## Installation

### 1. Clone the repository
```
git clone https://github.com/IgnatiusReillius/S5.02-Frontend_API
cd S5.02-Frontend_API
```

### 2. Install PHP dependencies
```
npm install
```

### 3. Configure the backend URL

Configure the config.es file so that it has the same address as the backend.
```
export const API_BASE = "http://127.0.0.1:8000/api";
```

### 3. Create your environment file
```
npm run dev
```

This command will return a message similar to:

```
  ➜  Local:   http://localhost:5173/
```

With this URL, you will be able to access the application.

## Testing the Application

Now you can test the frontend.

You can register with a new username, but you will not have administrator permissions to access all features. To do so, or to simply test an existing user, you can use one of the following already registered users:

| Role | Email | Password |
|--------|----------|-------------|
| Admin | admin@biblio.com  | password |
| User | imclaughlin@example.org | password |

## License

This project is for educational purposes and part of the IT Academy exercises.