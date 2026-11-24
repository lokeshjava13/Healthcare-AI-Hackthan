export default function Button({
  children,
  onClick,
  variant = 'primary',
  full = false,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`button button-${variant}${full ? ' button-full' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}