Some images:
![image](https://github.com/user-attachments/assets/73c54d7d-e188-4194-bce3-a7534d2949e5)
![image](https://github.com/user-attachments/assets/d61c6880-23fd-46ce-92f3-4fb60f79fa78)
![image](https://github.com/user-attachments/assets/5a852840-b23f-4c17-9843-25fbcc2477cd)
![image](https://github.com/user-attachments/assets/11e554f7-5531-4154-addf-f761157a0c1f)
![image](https://github.com/user-attachments/assets/bf36cca7-c94d-48f4-99f7-6b905b54ddf5)
![image](https://github.com/user-attachments/assets/baef0c31-63d5-43ba-930f-bc62abb7f828)
![image](https://github.com/user-attachments/assets/0483df30-cb71-40d5-9228-ce56049c1d43)
![image](https://github.com/user-attachments/assets/09044bb4-9f87-4c93-a3ef-2161e98f092f)
![image](https://github.com/user-attachments/assets/d74f0ad9-dc95-4e04-a3c7-4bdaa7bf48bd)




# Library Management System

A modern library management system built with Next.js (App Router), Prisma, and JWT authentication. This open-source project provides an efficient way to manage books, students, and borrowings.

## Features

- **Authentication**: Secure login for teachers using JWT.
- **Book Management**: CRUD operations for managing books in the library.
- **Student Management**: CRUD operations for managing student records.
- **Borrowing System**: Track borrowings, including statuses (BORROWED, RETURNED, OVERDUE).
- **Responsive Design**: Optimized for both desktop and mobile views.
- **Modular Codebase**: Clean and reusable components.

## Project Structure

```plaintext
.
├── prisma/                       # Prisma schema and migrations
│   ├── migrations/               # Database migrations
│   └── schema.prisma             # Prisma schema file
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication routes
│   │   │   ├── books/            # Book-related routes
│   │   │   ├── borrowings/       # Borrowing-related routes
│   │   │   └── students/         # Student-related routes
│   │   ├── components/           # Reusable components
│   │   │   ├── layout/           # Layout components
│   │   │   └── ui/               # UI components
│   │   ├── dashboard/            # Dashboard pages
│   │   ├── globals.css           # Global styles
│   │   ├── layout.js             # Root layout
│   │   ├── login/                # Login page
│   │   └── page.js               # Home page
├── public/                       # Public assets
├── prisma/                       # Prisma schema and migrations
├── jest.config.js                # Jest configuration
├── next.config.mjs               # Next.js configuration
├── tailwind.config.mjs           # Tailwind CSS configuration
└── README.md                     # Project documentation
```

## Environment Variables

This project requires the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for JWT token generation.

Create a `.env` file in the root directory and add the variables:

```plaintext
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jamolweb/library-web.git
   cd library-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   - Ensure PostgreSQL is running.
   - Update the `DATABASE_URL` in your `.env` file.
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Authentication**: Teachers can log in to access the dashboard.
- **Dashboard**: Manage books, students, and borrowings through the intuitive UI.
- **API**: RESTful endpoints for books, students, and borrowings.

## Technologies Used

- **Frontend**: Next.js (App Router), Tailwind CSS.
- **Backend**: Prisma, PostgreSQL.
- **Authentication**: JSON Web Tokens (JWT).
- **Testing**: Jest (optional setup included).

## Contribution

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Jamoladdin](https://t.me/jamoldev).
```

Make sure to replace placeholders like `https://github.com/jamolweb/library-web.git` with your actual repository link and `Your Name` with your name.
