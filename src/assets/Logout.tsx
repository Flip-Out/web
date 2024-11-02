export default function Logout({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.5 9V5.25C14.5 4.00736 13.4926 3 12.25 3L6.25 3C5.00736 3 4 4.00736 4 5.25L4 18.75C4 19.9926 5.00736 21 6.25 21H12.25C13.4926 21 14.5 19.9926 14.5 18.75V15M17.5 15L20.5 12M20.5 12L17.5 9M20.5 12L7.75 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
