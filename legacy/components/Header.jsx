import { navItems } from "../data/content";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 pt-6 pb-5 backdrop-blur-md sm:pt-8 sm:pb-6">
      <nav aria-label="Principal">
        <ul className="flex items-center justify-center gap-6 text-xs font-bold tracking-wide sm:gap-10 sm:text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-opacity hover:opacity-60">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
