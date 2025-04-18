import React, { useState } from 'react';
import LeftSection from './left-section';
import RightSection from './right-section';

interface SplitLayoutProps {
  // You can add props here as needed
}

const SplitLayout: React.FC<SplitLayoutProps> = () => {
  // Lifted state from left-section.tsx to be shared
  const [pdfData, setPdfData] = useState<any>(null); // Store PDF text data

  return (
    <div className="flex w-full h-screen">
      <LeftSection pdfData={pdfData} setPdfData={setPdfData} />
      <RightSection pdfData={pdfData} />
    </div>
  );
};

export default SplitLayout;