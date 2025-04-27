/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import LeftSection from './left-section';
import RightSection from './right-section';


const SplitLayout: React.FC = () => {
  // Lifted state from left-section.tsx to be shared
  const [pdfData, setPdfData] = useState<any>(null); // Store PDF text data
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeSection, setActiveSection] = useState<'left' | 'right'>('left');

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When PDF is loaded, switch to chat view on mobile
  useEffect(() => {
    if (pdfData && isMobileView) {
      setActiveSection('right');
    }
  }, [pdfData, isMobileView]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* On mobile, conditionally show either left or right section based on activeSection */}
      {(!isMobileView || activeSection === 'left') && (
        <LeftSection 
          pdfData={pdfData} 
          setPdfData={setPdfData} 
          className={isMobileView ? 'w-full h-screen' : 'w-1/2 h-screen'} 
          onSwitchToChat={() => setActiveSection('right')}
          isMobileView={isMobileView}
        />
      )}
      
      {(!isMobileView || activeSection === 'right') && (
        <RightSection 
          pdfData={pdfData} 
          className={isMobileView ? 'w-full h-screen' : 'w-1/2 h-screen'}
          onSwitchToPdf={() => setActiveSection('left')}
          isMobileView={isMobileView}
        />
      )}
    </div>
  );
};

export default SplitLayout;