import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const NavIcons = {
  dashboard: (
    <Icon>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  ),
  artist: (
    <Icon>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </Icon>
  ),
  works: (
    <Icon>
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M4 16l4.5-4 3 2.5 2.5-2 6 5.5" />
    </Icon>
  ),
  exhibition: (
    <Icon>
      <rect x="4" y="5" width="16" height="15" rx="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </Icon>
  ),
  contacts: (
    <Icon>
      <path d="M6 6h12v12H6z" />
      <path d="M9 10h6M9 14h4" />
      <path d="M8 6V4h8v2" />
    </Icon>
  ),
  editor: (
    <Icon>
      <path d="M4 6h16v12H4z" />
      <path d="M8 10h8M8 14h5" />
      <path d="M15 4l5 5" />
    </Icon>
  ),
  generate: (
    <Icon>
      <path d="M8 4h8l4 4v12H4V4h4z" />
      <path d="M12 4v4h4" />
      <path d="M8 13h8M8 17h5" />
    </Icon>
  ),
  settings: (
    <Icon>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
    </Icon>
  ),
  export: (
    <Icon>
      <path d="M12 4v10" />
      <path d="M8 10l4 4 4-4" />
      <path d="M5 18h14" />
    </Icon>
  ),
  menu: (
    <Icon>
      <path d="M5 7h14M5 12h14M5 17h14" />
    </Icon>
  ),
  collapse: (
    <Icon>
      <path d="M9 6l-6 6 6 6M15 18l6-6-6-6" />
    </Icon>
  ),
};

export type NavIconKey = keyof typeof NavIcons;
