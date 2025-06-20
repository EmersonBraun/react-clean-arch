import type { FieldInputProps, FieldMetaProps } from 'formik'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  required?: boolean
  field: FieldInputProps<string>
  meta: FieldMetaProps<string>
  disabled?: boolean
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  field,
  meta,
  disabled = false,
}: FormFieldProps) {
  const hasError = meta.touched && meta.error
  const inputId = `form-field-${name}`

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...field}
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
          hasError
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
      />
      {hasError && (
        <div className="mt-1 text-sm text-red-600">
          {meta.error}
        </div>
      )}
    </div>
  )
} 