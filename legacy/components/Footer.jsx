import { socials } from "../data/content";
import { BehanceMark, GitHubIcon, LinkedInIcon } from "./icons";

const marks = {
  github: <GitHubIcon className="h-5 w-5" />,
  linkedin: <LinkedInIcon className="h-5 w-5" />,
  behance: <BehanceMark className="text-lg" />,
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <ul className="mx-auto flex max-w-4xl items-center justify-center gap-10 px-6 py-7 sm:gap-14 sm:px-8">
        {socials.map((social) => (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className="flex h-6 items-center justify-center transition-opacity hover:opacity-60"
            >
              {marks[social.id]}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
