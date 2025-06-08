import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface ToolbarButtonProps {
  icon?: LucideIcon
  children?: ReactNode
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  title?: string
  variant?: "default" | "danger"
  className?: string
}

export default function ToolbarButton({
  icon: Icon,
  children,
  onClick,
  disabled = false,
  active = false,
  title,
  variant = "default",
  className = "",
}: ToolbarButtonProps) {
  const baseClasses = "inline-flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 group"

  const variantClasses = {
    default: active
      ? "bg-blue-100 text-blue-700 border border-blue-200"
      : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm",
    danger: active
      ? "bg-red-100 text-red-700 border border-red-200"
      : "text-gray-700 hover:bg-white hover:text-red-600 hover:shadow-sm",
  }

  const disabledClasses = "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-700 hover:shadow-none"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        ${baseClasses}
        ${disabled ? disabledClasses : variantClasses[variant]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
      {children}
    </button>
  )
}
