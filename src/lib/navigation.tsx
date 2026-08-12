import React, { useEffect, useState } from 'react';

/**
 * Minimal client-side routing for the two pages this site has.
 *
 * A full router library would be more machinery than two routes justify, so
 * this wraps the History API directly. `vercel.json` rewrites /gallery to
 * index.html so deep links and refreshes resolve.
 */

const ROUTE_EVENT = 'icook:routechange';

export const ROUTES = {
  home: '/',
  gallery: '/gallery'
} as const;

export const navigate = (to: string) => {
  if (window.location.pathname === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event(ROUTE_EVENT));
};

export const useRoute = (): string => {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    // popstate covers back/forward; the custom event covers our own pushes.
    window.addEventListener('popstate', sync);
    window.addEventListener(ROUTE_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(ROUTE_EVENT, sync);
    };
  }, []);

  return path;
};

interface RouteLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export const RouteLink: React.FC<RouteLinkProps> = ({ to, children, onClick, ...rest }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    // Leave modified clicks to the browser so "open in new tab" still works.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
