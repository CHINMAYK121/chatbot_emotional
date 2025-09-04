import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-gradient-to-r from-sky-400/30 to-blue-500/30 dark:from-sky-900/50 dark:to-blue-800/50 animate-gradient-bg bg-[length:400%_400%]"></div>
    </div>
  );
};

export default AnimatedBackground;