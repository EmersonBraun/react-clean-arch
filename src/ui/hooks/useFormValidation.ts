import type { FormikHelpers, FormikValues } from 'formik'

import { FormValidationService } from '../../application/services/FormValidationService'
import { useCallback } from 'react'
import { z } from 'zod'

export interface ValidationError {
  field: string
  message: string
}

export function useFormValidation<T extends FormikValues>(schema: z.ZodSchema<T>) {
  const validateForm = useCallback(
    async (values: T): Promise<Partial<Record<keyof T, string>>> => {
      try {
        schema.parse(values)
        return {}
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Partial<Record<keyof T, string>> = {}
          
          error.errors.forEach((err) => {
            const field = err.path[0] as keyof T
            if (field) {
              errors[field] = err.message
            }
          })
          
          return errors
        }
        return {}
      }
    },
    [schema]
  )

  const handleSubmit = useCallback(
    async (
      values: T,
      formikHelpers: FormikHelpers<T>,
      onSubmit: (values: T) => Promise<void>
    ) => {
      try {
        await onSubmit(values)
      } catch (error) {
        if (error instanceof Error) {
          formikHelpers.setFieldError('general', error.message)
        }
      }
    },
    []
  )

  return {
    validateForm,
    handleSubmit,
  }
}

// Specialized hook for edit profile form
export function useEditProfileFormValidation() {
  const validateEditProfileForm = useCallback(
    async (values: { name: string; email: string }): Promise<Partial<Record<string, string>>> => {
      const result = FormValidationService.validateEditProfileForm(values)
      
      if (result.success) {
        return {}
      }
      
      return result.errors || {}
    },
    []
  )

  const handleEditProfileSubmit = useCallback(
    async (
      values: { name: string; email: string },
      formikHelpers: FormikHelpers<{ name: string; email: string; general?: string }>,
      onSubmit: (values: { name: string; email: string }) => Promise<void>
    ) => {
      try {
        await onSubmit(values)
      } catch (error) {
        if (error instanceof Error) {
          formikHelpers.setFieldError('general', error.message)
        }
      }
    },
    []
  )

  return {
    validateEditProfileForm,
    handleEditProfileSubmit,
  }
} 