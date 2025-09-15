// components/ui/textarea.tsx - Clean Textarea Component

import * as React from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helperText?: string
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, helperText, label, ...props }, ref) => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
    const errorClasses = error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          className={combinedClasses}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={`mt-1 text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }