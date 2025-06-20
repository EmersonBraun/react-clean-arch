import { useFormik } from 'formik'
import { useEffect } from 'react'

import type { UserProfileDto } from '../../../application/dto/UserProfileDto'
import { type EditProfileFormData } from '../../../domain/entities/UserProfileValidation'
import { useEditProfileFormValidation } from '../../hooks/useFormValidation'
import { useUpdateUserProfile } from '../../hooks/useUpdateUserProfile'
import { FormField } from '../common/FormField'

interface EditProfileFormProps {
  profile: UserProfileDto
  onSuccess?: () => void
  onCancel?: () => void
}

interface ExtendedEditProfileFormData extends EditProfileFormData {
  general?: string
}

export function EditProfileForm({ profile, onSuccess, onCancel }: EditProfileFormProps) {
  const { updateProfile, loading, error, success, reset } = useUpdateUserProfile()
  const { validateEditProfileForm, handleEditProfileSubmit } = useEditProfileFormValidation()

  useEffect(() => {
    if (success) {
      onSuccess?.()
      reset()
    }
  }, [success, onSuccess, reset])

  const initialValues: ExtendedEditProfileFormData = {
    name: profile.name,
    email: profile.email,
  }

  const onSubmit = async (values: EditProfileFormData) => {
    const hasChanges = values.name !== profile.name || values.email !== profile.email
    
    if (!hasChanges) {
      onCancel?.()
      return
    }

    await updateProfile({
      userId: profile.id,
      name: values.name !== profile.name ? values.name : undefined,
      email: values.email !== profile.email ? values.email : undefined,
    })
  }

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  const formik = useFormik<ExtendedEditProfileFormData>({
    initialValues,
    validate: validateEditProfileForm,
    onSubmit: (values, formikHelpers) => handleEditProfileSubmit(values, formikHelpers, onSubmit),
    enableReinitialize: false,
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormField
          label="Name"
          name="name"
          type="text"
          required
          field={formik.getFieldProps('name')}
          meta={formik.getFieldMeta('name')}
          disabled={loading}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          required
          field={formik.getFieldProps('email')}
          meta={formik.getFieldMeta('email')}
          disabled={loading}
        />

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {formik.errors.general && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {formik.errors.general}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || formik.isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || formik.isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || formik.isSubmitting}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 