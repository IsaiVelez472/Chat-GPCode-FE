import React, { useState, useEffect } from 'react';
import { HiOutlineClock, HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import Button from './Button';
import Progress from './Progress';

/**
 * TrialBanner component for displaying trial status information
 * @param {Object} props - Component props
 * @param {number} props.daysLeft - Number of days left in trial
 * @param {number} props.totalDays - Total number of days in trial period
 * @param {number} props.creditsLeft - Number of credits left
 * @param {number} props.totalCredits - Total number of credits
 * @param {Function} props.onUpgrade - Function to call when upgrade button is clicked
 * @returns {JSX.Element|null} TrialBanner component or null if trial is expired
 */
const TrialBanner = ({
  daysLeft,
  totalDays = 14,
  creditsLeft,
  totalCredits = 5,
  onUpgrade
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check if the device is mobile or tablet
  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640); // sm breakpoint in Tailwind
      setIsTablet(width >= 640 && width < 1024); // between sm and lg
    };
    
    // Initial check
    checkDeviceSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  const daysPercentage = Math.round((daysLeft / totalDays) * 100);
  const creditsPercentage = Math.round((creditsLeft / totalCredits) * 100);

  const creditsProgress = creditsPercentage >= 70 ? 0 : creditsPercentage;

  // if (creditsProgress === 0 || daysPercentage === 0) return null;

  // Collapsible banner for mobile/tablet
  if (isMobile || isTablet) {
    return (
      <div className="fixed right-0 top-1/3 z-50 flex">
        {/* Toggle button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white border-l border-t border-b border-gray-200 rounded-l-lg p-2 flex items-center justify-center h-20 shadow-sm"
        >
          {isExpanded ? 
            <HiOutlineChevronRight className="h-6 w-6 text-blue-600" /> : 
            <HiOutlineChevronLeft className="h-6 w-6 text-blue-600" />
          }
        </button>
        
        {/* Banner content */}
        <div 
          className={`bg-white border-t border-b border-r border-gray-200 rounded-r-lg transition-all duration-300 ease-in-out overflow-hidden shadow-sm ${isExpanded ? (isMobile ? 'w-[85vw]' : 'w-80') : 'w-0'}`}
        >
          <div className={`p-4 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className='flex items-center justify-between mb-2'>
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center bg-blue-100 rounded-full p-1 mr-2">
                  <HiOutlineClock className="h-5 w-5 text-blue-600" />
                </span>
                <h3 className="text-base font-medium text-gray-800">Estás usando el plan de prueba</h3>
              </div>
              
              {/* Button positioned differently based on device */}
              {isMobile ? (
                <Button
                  onClick={onUpgrade}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center mt-2 w-full justify-center"
                >
                  Actualizar plan
                  <HiOutlineArrowRight className='h-4 w-4 ml-1' />
                </Button>
              ) : null}
            </div>
            
            <div className='space-y-3 mt-3'>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Días restantes</span>
                  <span className="font-medium text-gray-800">{daysLeft} de {totalDays}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${daysPercentage}%` }}
                  ></div>
                </div>
              </div>

              {creditsProgress > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Créditos disponibles</span>
                    <span className="font-medium text-gray-800">{creditsLeft} de {totalCredits}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${creditsProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Button for tablet only - positioned at bottom right */}
              {isTablet ? (
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={onUpgrade}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center"
                  >
                    Actualizar plan
                    <HiOutlineArrowRight className='h-4 w-4 ml-1' />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop version (always expanded)
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center bg-blue-100 rounded-full p-1 mr-2">
            <HiOutlineClock className="h-5 w-5 text-blue-600" />
          </span>
          <h3 className="text-base font-medium text-gray-800">Estás usando el plan de prueba</h3>
        </div>
        <Button
          onClick={onUpgrade}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center"
        >
          Actualizar plan
          <HiOutlineArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Días restantes</span>
            <span className="font-medium text-gray-800">{daysLeft} de {totalDays}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${daysPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {creditsProgress > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Créditos disponibles</span>
              <span className="font-medium text-gray-800">{creditsLeft} de {totalCredits}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${creditsProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialBanner;
