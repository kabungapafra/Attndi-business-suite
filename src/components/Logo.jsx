
/** Attndi mark — orange disc with white stylized A, matching the mockup logo */
export default function Logo({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#F97316" />
      <path
        d="M16 7.2L23.4 23.2H20.55L18.85 19.15H13.15L11.45 23.2H8.6L16 7.2Z"
        fill="white"
      />
      <path d="M14.05 16.85H17.95L16 12.2L14.05 16.85Z" fill="#F97316" />
    </svg>
  );
}
