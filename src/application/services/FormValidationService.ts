import { EditProfileFormSchema, type EditProfileFormData } from '../../domain/entities/UserProfileValidation'

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: Record<string, string>
}

export class FormValidationService {
  static validateEditProfileForm(data: unknown): ValidationResult<EditProfileFormData> {
    const result = EditProfileFormSchema.safeParse(data)
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      }
    }

    const errors: Record<string, string> = {}
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string
      if (field) {
        errors[field] = err.message
      }
    })

    return {
      success: false,
      errors,
    }
  }

  static validateEditProfileFormStrict(data: unknown): EditProfileFormData {
    return EditProfileFormSchema.parse(data)
  }
} 