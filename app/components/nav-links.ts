interface NavLink {
  href: string;
  label: string;
  isHighlighted?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'HOME' },
  { href: '/prayertimes', label: 'PRAYER TIMES' },
  { href: '/programs', label: 'PROGRAMS' },
  { href: '/events', label: 'EVENTS' },
  { href: '/weekendschool', label: 'WEEKEND SCHOOL' },
  { href: '/volunteer', label: 'VOLUNTEER' },
  {
    href: '/nowhiring',
    label: 'NOW HIRING',
    isHighlighted: true
  }
] as const;
