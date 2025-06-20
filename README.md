# React + TypeScript + Vite + Clean Architecture

This project demonstrates the implementation of Clean Architecture in a React application with TypeScript and Vite. The application manages user profiles with features for listing, viewing, editing, and membership upgrades.

## 🏗️ Architecture

The project follows Clean Architecture principles, organizing code into well-defined layers:

### 📁 Project Structure

```
src/
├── domain/           # Domain layer (business rules)
│   ├── entities/     # Domain entities
│   └── repositories/ # Repository interfaces
├── application/      # Application layer (use cases)
│   ├── use-cases/    # Application use cases
│   ├── services/     # Application services
│   └── dto/          # Data transfer objects
├── infrastructure/   # Infrastructure layer
│   ├── repositories/ # Repository implementations
│   ├── services/     # External services
│   └── config/       # Configuration
└── ui/              # Interface layer (presentation)
    ├── components/   # React components
    ├── pages/        # Application pages
    ├── hooks/        # Custom hooks
    └── providers/    # React providers
```

### 🎯 Architecture Layers

#### **Domain Layer** (`src/domain/`)
- **Entities**: Define core business rules (e.g., `User`)
- **Repositories**: Interfaces that define contracts for data access
- **Validation**: Domain validation rules

#### **Application Layer** (`src/application/`)
- **Use Cases**: Orchestrate business operations
  - `GetUserProfile`: Retrieves user profile
  - `UpdateUserProfile`: Updates user data
  - `ListUsers`: Lists all users
  - `UpgradeMembership`: Handles membership upgrades
- **Services**: Application services
- **DTOs**: Objects for data transfer between layers

#### **Infrastructure Layer** (`src/infrastructure/`)
- **Repositories**: Concrete implementations of repositories
  - `MockUserRepository`: Implementation with mocked data
- **Services**: External service integrations
- **Config**: Application configuration

#### **UI Layer** (`src/ui/`)
- **Components**: Reusable React components
- **Pages**: Application pages
- **Hooks**: Custom hooks for UI logic
- **Providers**: Providers for dependency injection

## 🚀 Technologies Used

- **React 19** - User interface library
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Formik** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons
- **Faker.js** - Mock data generation

## 🛠️ How to Run

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn or bun

### Installation
```bash
# With npm
npm install

# With yarn
yarn install

# With bun
bun install
```

### Development
```bash
# With npm
npm run dev

# With yarn
yarn dev

# With bun
bun dev
```

### Build
```bash
# With npm
npm run build

# With yarn
yarn build

# With bun
bun run build
```

### Linting
```bash
# With npm
npm run lint

# With yarn
yarn lint

# With bun
bun run lint
```

## 🎨 Features

### Users
- **Listing**: View all users
- **Profile**: Detailed profile view
- **Editing**: Update personal data
- **Upgrade**: Membership improvement

### Validation
- Form validation with Zod
- Domain validation with business rules
- Error handling with Error Boundary

### Dependency Injection
- DI container for dependency management
- Clear separation between implementations and interfaces

## 📋 Clean Architecture Principles

1. **Framework Independence**: Domain doesn't depend on React or other libraries
2. **Testability**: Each layer can be tested independently
3. **UI Independence**: Business logic doesn't depend on the interface
4. **Database Independence**: Domain doesn't know persistence details
5. **External Agency Independence**: Business rules don't depend on external APIs

## 📝 License

This project is open source and available under the MIT license.
