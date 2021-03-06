import * as s from './style.module.less';
import React, { useState, useEffect } from 'react';

export const OnboardingOverlayContext = React.createContext();

export const OnboardingOverlayProvider = ({ children }) => {
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle(s.bodyOverlayOpen, overlayOpen);
  }, [overlayOpen]);

  return (
    <OnboardingOverlayContext.Provider
      value={{
        overlayOpen,
        setOverlayOpen,
      }}
    >
      {children}
    </OnboardingOverlayContext.Provider>
  );
};
