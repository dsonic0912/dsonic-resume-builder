# dSonic Resume Builder

A modern, minimalist resume builder web application with a clean, print-friendly layout. Create, edit, and export your professional resume with ease.

## Features

- **Edit Mode**: Toggle between view and edit modes to easily update your resume content
- **Print-Friendly Layout**: Optimized for printing and PDF export
- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Modern UI**: Built with Next.js 14, React, TypeScript, and Tailwind CSS
- **Command Menu**: Quick access to actions and links
- **Database Integration**: PostgreSQL database with Prisma ORM
- **Admin Panel**: Built-in admin interface for managing resume data
- **GraphQL API**: Apollo Server integration for data access

## Key Components

- **Work Experience**: Add, edit, and remove work history entries with company details, dates, and descriptions
- **Projects**: Showcase your projects with descriptions and technology stacks
- **Education**: Display your educational background
- **Summary**: Highlight your professional summary and skills
- **Contact Information**: Include your contact details and social media links

## Getting Started

### Prerequisites

- Node.js (v18.17.0 or higher)
- Yarn package manager
- PostgreSQL database (for full functionality)

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/dsonic-resume-builder.git
   ```

2. Navigate to the project directory:

   ```bash
   cd dsonic-resume-builder
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Create a `.env` file in the root directory with your database connection string:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/resume_db"
   ```

5. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

### Development

Start the development server:

```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

Build the application for production:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## Docker Deployment

### Build the Container

```bash
docker compose build
```

### Run the Container

```bash
docker compose up -d
```

### Stop the Container

```bash
docker compose down
```

## Project Structure

```
dsonic-resume-builder/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── components/       # Resume section components
│   │   ├── admin/            # Admin panel routes
│   │   ├── api/              # API routes
│   │   ├── graphql/          # GraphQL API
│   │   └── page.tsx          # Main resume page
│   ├── apollo/               # Apollo GraphQL setup
│   ├── components/           # Shared UI components
│   │   └── ui/               # Base UI components
│   ├── context/              # React context providers
│   │   ├── edit-mode-context.tsx  # Edit mode state management
│   │   └── resume-context.tsx     # Resume data state management
│   ├── data/                 # Resume data
│   │   └── resume-data.tsx   # Default resume data
│   └── lib/                  # Utility functions
├── prisma/                   # Prisma ORM configuration
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
├── docker-compose.yaml       # Docker configuration
└── package.json              # Project dependencies
```

## Customization

### Editing Resume Data

1. Toggle the edit mode switch in the bottom right corner of the application
2. Click on any section to edit its content
3. Save your changes

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying:

- `tailwind.config.js` - For theme configuration
- `src/app/globals.css` - For global styles

## License

[MIT](https://choosealicense.com/licenses/mit/)