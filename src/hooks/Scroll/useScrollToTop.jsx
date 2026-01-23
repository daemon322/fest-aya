// hooks/useScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Opciones para un scroll suave
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // o 'auto' para instantáneo
    });
  }, [pathname]);
};