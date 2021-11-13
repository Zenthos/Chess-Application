import React from 'react';

interface FadeType {
  children: React.ReactNode | React.ReactNode[];
}

const FadeIn = ({ children }: FadeType) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default FadeIn;
