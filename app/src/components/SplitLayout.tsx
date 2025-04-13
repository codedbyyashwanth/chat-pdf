import React from 'react';
import LeftSection from './left-section';
import RightSection from './right-section';

interface SplitLayoutProps {
  // You can add props here as needed
}

const SplitLayout: React.FC<SplitLayoutProps> = () => {
  return (
    <div className="flex w-full h-screen">
      <LeftSection />
      <RightSection />
    </div>
  );
};

export default SplitLayout;