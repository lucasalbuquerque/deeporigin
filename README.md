# DeepOrigin - URL Shortener

A modern URL shortening service built with a Next.js frontend and NestJS backend.

## Overview

DeepOrigin allows users to create shortened versions of long URLs, making them easier to share and remember. For example:

### Running the Application

You can run the application using the following commands:

```bash
docker compose up -d --build
```

### Available Commands

- `npm install`: Installs all dependencies across the monorepo
- `npm run build`: Builds all packages and applications in the monorepo using Turborepo
- `npm run dev`: Starts all applications in development mode
- `npm run lint`: Runs linting across all packages and applications
- `npm run format`: Formats all TypeScript, TSX, and Markdown files using Prettier
- `npm run check-types`: Runs TypeScript type checking across all packages

This will start the Next.js frontend and NestJS backend, and make them available at `http://localhost:3000` and `http://localhost:3001` respectively.

### Creating a Short URL

To create a short URL, navigate to the frontend application at `http://localhost:3000` and follow the instructions.

### Redirecting to the Original URL

To redirect to the original URL, navigate to `http://localhost:3000/your-short-url` in your browser.

## Technologies Used

### Frontend

The frontend is built with Next.js and TypeScript. It uses the following technologies:

- Next.js
- TypeScript
- Tailwind CSS

### Backend

The backend is built with NestJS and TypeScript. It uses the following technologies:

- NestJS
- TypeScript
- TypeORM
- SQLite

## Contributing

We welcome contributions to DeepOrigin! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## License

DeepOrigin is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or feedback, please contact us at [lucasalbuquerquejs@gmail.com](mailto:lucasalbuquerquejs@gmail.com).
