import React, { useMemo } from 'react';
import { profileLinks } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import {
  IconLinkedin,
  IconGithub,
  IconLeetcode,
  IconHackerrank,
  IconGeeksforgeeks,
  IconInstagram,
} from './icons/BrandIcons';
import { Mail } from 'lucide-react';
import { Reveal } from './Reveal';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LinkedIn: IconLinkedin,
  GitHub: IconGithub,
  LeetCode: IconLeetcode,
  HackerRank: IconHackerrank,
  GeeksforGeeks: IconGeeksforgeeks,
  Instagram: IconInstagram,
  Email: Mail,
};

interface SocialLinksProps {
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = '' }) => {
  const { data } = usePortfolio();
  const activeLinks = useMemo(() => {
    return profileLinks
      .map((link) => {
        if (link.name === 'GitHub' && data.hero.githubUrl) {
          return { ...link, url: data.hero.githubUrl };
        }
        if (link.name === 'LinkedIn' && data.hero.linkedinUrl) {
          return { ...link, url: data.hero.linkedinUrl };
        }
        if (link.name === 'Email' && data.contact.email) {
          return { ...link, url: `mailto:${data.contact.email}` };
        }
        return link;
      })
      .filter(
        (link) => link.url && (link.url.startsWith('https://') || link.url.startsWith('mailto:'))
      );
  }, [data.hero.githubUrl, data.hero.linkedinUrl, data.contact.email]);

  if (activeLinks.length === 0) return null;

  return (
    <Reveal delay={100} className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {activeLinks.map((link) => {
          const Icon = iconMap[link.name];
          if (!Icon) return null;

          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.name} profile (opens in a new tab)`}
              className="group relative flex items-center justify-center w-10 h-10 rounded-md bg-white/[0.02] border border-white/10 text-zinc-400 hover:text-orange-400 hover:border-orange-500 hover:shadow-[0_0_12px_rgba(245,165,36,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-colors duration-200 ease-in-out motion-reduce:transition-none motion-reduce:hover:shadow-none"
            >
              <Icon className="w-4 h-4" />
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface border border-border text-xs text-textMain rounded opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-mono">
                {link.name}
              </span>
            </a>
          );
        })}
      </div>
    </Reveal>
  );
};
