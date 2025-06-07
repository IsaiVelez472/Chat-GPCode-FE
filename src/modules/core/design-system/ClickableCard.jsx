import React from 'react';
import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';

const ClickableCard = ({ children, redirectTo, description, icon: Icon, onClick }) => {
  const cardContent = (
    <>
      <div className='flex items-center mb-3'>
        {Icon && <Icon className='text-2xl mr-3 text-primary' />}
        <h3 className='text-lg font-semibold'>{children}</h3>
      </div>
      <p className='text-sm text-gray-300 mb-4'>{description}</p>
      <div className='mt-auto flex justify-end'>
        <HiChevronRight className='text-primary text-xl' />
      </div>
    </>
  );

  const cardClasses = "bg-dark-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-dark-600 hover:border-primary flex flex-col h-full";

  if (onClick) {
    return (
      <div 
        onClick={onClick} 
        className={`${cardClasses} w-full text-left`}
      >
        {cardContent}
      </div>
    );
  }
  
  return (
    <Link 
      to={redirectTo} 
      className={cardClasses}
    >
      {cardContent}
    </Link>
  );
};

export default ClickableCard;
