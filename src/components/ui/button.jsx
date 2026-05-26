export function Button({ className = "", children, variant, size, ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}