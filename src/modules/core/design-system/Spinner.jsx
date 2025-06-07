const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="relative flex justify-center items-center">
      {/* Outer spinning ring */}
      <div 
        className={`${sizes[size]} border-4 border-primary/30 border-t-primary rounded-full animate-[spin_1s_linear_infinite]`}
      />
      
      {/* Inner pulsing dot */}
      <div 
        className={`absolute ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} 
        bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_infinite]`}
      />
      
      {/* Glowing effect */}
      <div 
        className={`absolute ${sizes[size]} rounded-full 
        animate-[ping_2s_ease-in-out_infinite] opacity-20 bg-primary`}
      />
    </div>
  );
};

export default Spinner;
