import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

interface ScrollToTopProps {
  children: React.ReactElement;
}

// This component scrolls to the top upon every page navigation
const ScrollToTop = ({ children }: ScrollToTopProps) => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash)
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default ScrollToTop;
