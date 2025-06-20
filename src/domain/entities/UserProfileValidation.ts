import { z } from 'zod'

export const EditProfileFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Name can only contain letters, spaces, and accents'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
})

export type EditProfileFormData = z.infer<typeof EditProfileFormSchema>

export const validateEditProfileForm = (data: unknown): EditProfileFormData => {
  return EditProfileFormSchema.parse(data)
}

export const validateEditProfileFormSafe = (data: unknown) => {
  return EditProfileFormSchema.safeParse(data)
} 