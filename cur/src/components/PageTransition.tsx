import { useEffect, ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reset visibility on route change
    setIsVisible(false);
    
    // Scroll to top immediately for instant navigation
    window.scrollTo({ top: 0, behavior: "instant" });
    
    // Trigger fade-in animation after a tiny delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      key={location.pathname}
      className={`page-transition-wrapper ${isVisible ? 'page-transition-enter' : ''}`}
    >
      {children}
    </div>
  );
}

