"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Define proper TypeScript types
type ThemeOption = 'blue' | 'green' | 'purple' | 'red' | 'rainbow';
type VariantOption = 'default' | 'segments' | 'modern';
type HeightOption = 'small' | 'medium' | 'large' | 'xlarge';

interface DonorInfo {
  name: string;
  amount: number;
}

// Define types for animation properties
interface AnimationTransition {
  duration?: number;
  ease?: number[] | string;
}

interface AnimationConfig {
  transition?: AnimationTransition;
}

interface VariantConfig {
  container: string;
  bar: string;
  animation: AnimationConfig;
}

interface ThemeConfig {
  gradient: string;
  bg: string;
  text: string;
  highlight: string;
}

interface ProgressBarProps {
  currentAmount?: number;
  goalAmount?: number;
  currency?: string;
  title?: string;
  theme?: ThemeOption;
  variant?: VariantOption;
  height?: HeightOption;
  showMilestones?: boolean;
  recentDonors?: DonorInfo[];
  donations?: number;
}

const EnhancedProgressBar: React.FC<ProgressBarProps> = ({ 
  currentAmount = 40401, 
  goalAmount = 200000, 
  currency = '$',
  title = 'Fundraising Progress',
  theme = 'blue',
  variant = 'default',
  height = 'medium',
  showMilestones = true,
//   recentDonors = [],
  donations = 153
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate percentage
  const percentage = Math.min(Math.round((currentAmount / goalAmount) * 100), 100);
  
  // Height options
  const heightOptions: Record<HeightOption, string> = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6',
    xlarge: 'h-8'
  };
  
  const barHeight = heightOptions[height];
  
  // Theme colors
  const themes: Record<ThemeOption, ThemeConfig> = {
    blue: {
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      highlight: 'bg-blue-500'
    },
    green: {
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      highlight: 'bg-emerald-500'
    },
    purple: {
      gradient: 'from-violet-400 via-violet-500 to-violet-600',
      bg: 'bg-violet-100',
      text: 'text-violet-600',
      highlight: 'bg-violet-500'
    },
    red: {
      gradient: 'from-rose-400 via-rose-500 to-rose-600',
      bg: 'bg-rose-100',
      text: 'text-rose-600',
      highlight: 'bg-rose-500'
    },
    rainbow: {
      gradient: 'from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500',
      bg: 'bg-gray-100',
      text: 'text-indigo-600',
      highlight: 'bg-indigo-500'
    }
  };
  
  const currentTheme = themes[theme];
  
  // Style variants
  const variants: Record<VariantOption, VariantConfig> = {
    default: {
      container: 'rounded-full',
      bar: 'rounded-full',
      animation: {}
    },
    segments: {
      container: 'rounded-md',
      bar: 'rounded-sm',
      animation: {}
    },
    modern: {
      container: 'rounded-lg border border-gray-300',
      bar: 'rounded-md',
      animation: {
        transition: { 
          duration: 1.5,
          ease: [0.34, 1.56, 0.64, 1] // Custom spring-like ease
        }
      }
    }
  };
  
  const currentVariant = variants[variant];
  
  // Milestone positions
  const milestones = [25, 50, 75, 100];

  // Extract animation config safely
  const animationProps = {
    ...(currentVariant.animation || {})
  };
  
  const transitionProps = {
    duration: 1, 
    ease: "easeOut",
    ...(currentVariant.animation.transition || {})
  };

  function formatCurrency(amount: number) {
    return Number(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gradient-to-r from-blue-950 from-10% via-sky-900 via-30% to-emerald-950 to-90% rounded-xl shadow-xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-100">{title.toUpperCase()}</h3>
        <div className="flex justify-between mt-4">
        <span className='text-sky-200'>  Raised</span>
        <span className='text-emerald-200'>  Goal</span>
        </div>
        <div className="flex justify-between items-center mt-3 mb-4 gap-10 md:gap-20">
          <p className="text-sm text-gray-600">
          <span className="bg-sky-500 text-white p-2 rounded break-keep whitespace-nowrap text-sm md:text-lg font-black leading-loose md:leading-normal whitespace-normal">{currency} {formatCurrency(currentAmount)}</span>
          
          </p>
          <p className="text-sm text-gray-600">
            <span className="bg-emerald-600 text-white p-2 rounded break-keep whitespace-nowrap text-sm md:text-lg font-black leading-loose md:leading-normal whitespace-normal">{currency} {formatCurrency(goalAmount).toLocaleString()}</span>
          </p>
        </div>
      </div>
      
      {/* Progress bar container with milestone markers */}
      <div 
        className={`${barHeight} w-full ${currentTheme.bg} ${currentVariant.container} overflow-hidden relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Milestones */}
        {showMilestones && milestones.map(milestone => (
          <div 
            key={milestone}
            className="absolute top-0 bottom-0 w-px bg-white z-10 opacity-70"
            style={{ left: `${milestone}%` }}
          />
        ))}
        
        {/* Animated progress fill */}
        <motion.div 
          className={`h-full ${currentVariant.bar} bg-gradient-to-r ${currentTheme.gradient}`}
          initial={{ width: 0 }}
          animate={{ 
            width: `${percentage}%`,
            ...animationProps
          }}
          transition={transitionProps}
        >
          {/* Optional shimmer effect */}
          <motion.div 
            className="absolute top-0 bottom-0 w-20 bg-white/30"
            animate={{ 
              x: ['0%', '100%'],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "linear",
              repeatDelay: 1
            }}
          />
        </motion.div>
      </div>
      
      {/* Tooltip with details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10
        }}
        className="mt-2 p-2 bg-gray-800 text-white text-xs rounded absolute z-20"
        style={{ 
          display: isHovered ? 'block' : 'none',
          left: `calc(${Math.min(percentage, 97)}% - 50px)`
        }}
      >
        {percentage}% complete
        <div className="h-2 w-2 bg-gray-800 transform rotate-45 absolute -top-1 left-1/2 -ml-1"></div>
      </motion.div>
      
      {/* Milestone labels - FIXED POSITIONING */}
      <div className="mt-2 mb-2 pt-1 relative h-6">
        {milestones.map((milestone) => (
          <div 
            key={milestone}
            className="absolute text-xs"
            style={{ 
              left: `${milestone}%`, 
              transform: 'translateX(-50%)'
            }}
          >
            <span 
              className={`${percentage >= milestone ? currentTheme.text : 'text-gray-400'} font-medium`}
            >
              {milestone}%
            </span>
          </div>
        ))}
      </div>
      
      {/* Centered completion percentage on separate line */}
      <div className="w-full text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`inline-block ${currentTheme.highlight} text-white text-xs font-medium px-3 py-1 rounded-full`}
        >
          {percentage}% Complete
        </motion.div>
      </div>
      
      {/* Recent donors section */}
      {/* {recentDonors.length > 0 && (
        <div className="mt-1 text-sm">
          <p className="font-medium text-gray-700">Recent supporters:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {recentDonors.map((donor, index) => (
              <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs">
                {donor.name} ({currency}{donor.amount})
              </span>
            ))}
          </div>
        </div>
      )} */}
      
      {/* Supporter count */}
      <div className="mt-1 text-center text-sm text-gray-200">
        <span className="font-semibold">{donations}</span> donations
      </div>
    </div>
  );
};

export default EnhancedProgressBar;