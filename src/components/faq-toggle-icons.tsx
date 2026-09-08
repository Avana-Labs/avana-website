/** Plus/minus control for a Radix accordion trigger. */
export function FaqToggleIcons() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
      className="ml-auto h-6 w-6 shrink-0 text-gray-600"
      aria-hidden="true"
    >
      <path d="M5 12H19" />
      <path d="M12 5V19" className="transition-opacity duration-150 group-data-[state=open]:opacity-0" />
    </svg>
  )
}

export default FaqToggleIcons
