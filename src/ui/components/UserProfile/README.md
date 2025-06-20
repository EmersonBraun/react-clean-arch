# EditProfileForm - Clean Architecture Implementation

This component demonstrates the implementation of a form using Formik with Zod validation following Clean Architecture principles.

## Architecture Layers

### Domain Layer (`src/domain/entities/UserProfileValidation.ts`)
- Contains the core validation schema using Zod
- Defines the `EditProfileFormSchema` with validation rules
- Exports types and validation functions
- No dependencies on external frameworks

### Application Layer (`src/application/services/FormValidationService.ts`)
- Contains the `FormValidationService` that uses domain validation schemas
- Provides both safe and strict validation methods
- Acts as a bridge between domain validation and UI layer

### UI Layer (`src/ui/`)
- **Hooks** (`src/ui/hooks/useFormValidation.ts`): Custom hooks for form validation
- **Components** (`src/ui/components/common/FormField.tsx`): Reusable form field component
- **EditProfileForm** (`src/ui/components/UserProfile/EditProfileForm.tsx`): Main form component

## Key Features

### 1. Zod Validation Schema
```typescript
export const EditProfileFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
})
```

### 2. Form Validation Service
- `validateEditProfileForm()`: Returns validation result with errors
- `validateEditProfileFormStrict()`: Throws error for invalid data

### 3. Custom Hooks
- `useFormValidation()`: Generic form validation hook
- `useEditProfileFormValidation()`: Specialized hook for edit profile form

### 4. Reusable Components
- `FormField`: Generic form field component with error handling
- Integrates with Formik's Field component

## Usage

```typescript
import { EditProfileForm } from './EditProfileForm'

function UserProfilePage() {
  const handleSuccess = () => {
    // Handle successful update
  }

  const handleCancel = () => {
    // Handle cancel action
  }

  return (
    <EditProfileForm
      profile={userProfile}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
```

## Benefits of This Implementation

1. **Separation of Concerns**: Validation logic is separated from UI components
2. **Reusability**: Validation schemas and services can be reused across the application
3. **Type Safety**: Full TypeScript support with Zod schema inference
4. **Testability**: Each layer can be tested independently
5. **Maintainability**: Changes to validation rules only require updates in the domain layer
6. **Clean Architecture**: Dependencies flow inward, with domain layer being the most independent

## Validation Rules

- **Name**: Required, 2-50 characters, letters and spaces only
- **Email**: Required, valid email format, max 100 characters
- **Real-time validation**: Formik provides immediate feedback
- **Error handling**: Both field-specific and general errors are displayed 