// DESTINATION: vite-project/src/components/WorkflowStepper.jsx
// REPLACE ENTIRE FILE WITH THIS CODE

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const WorkflowStepper = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const steps = [
    { 
      label: 'Registration', 
      path: '/register', 
      icon: '👤',
      tooltip: 'Create your account to get started',
      estimatedTime: '2 min'
    },
    { 
      label: 'Select Tier', 
      path: '/tiers', 
      icon: '📊',
      tooltip: 'Choose the package that fits your needs',
      estimatedTime: '1 min'
    },
    { 
      label: 'Storage Option', 
      path: '/storage', 
      icon: '🔒',
      tooltip: 'Select how to securely store your data',
      estimatedTime: '1 min'
    },
    { 
      label: 'Data Selection', 
      path: '/upload', 
      icon: '📁',
      tooltip: 'Choose the files for analysis',
      estimatedTime: '3-5 min'
    },
    { 
      label: 'Vendor Map', 
      path: '/vendor', 
      icon: '🗺️',
      tooltip: 'View available third-party data',
      estimatedTime: '2 min'
    },
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: '📈',
      tooltip: 'View your analysis results',
      estimatedTime: '1 min'
    }
  ];

  // Don't show on landing page
  if (location.pathname === '/') {
    return null;
  }

  // Calculate current step index
  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);

  const containerStyle = {
    position: 'fixed',
    ...(isMobile ? {
      bottom: 0,
      left: 0,
      right: 0,
      top: 'auto',
      transform: 'none',
      borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
      margin: isExpanded ? '0' : '0 1rem 1rem 1rem',
    } : {
      left: isExpanded ? '2rem' : '0.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      borderRadius: '12px',
    }),
    backgroundColor: 'white',
    padding: isExpanded ? '1.5rem' : '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 100,
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'flex-start',
    gap: '1rem'
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          border: 'none',
          backgroundColor: 'var(--secondary-color)',
          color: 'white',
          width: isMobile ? '100%' : '24px',
          height: '24px',
          borderRadius: isMobile ? '4px' : '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          fontSize: '14px'
        }}
      >
        {isMobile ? (isExpanded ? '↓ Hide Steps' : '↑ Show Steps') : (isExpanded ? '←' : '→')}
      </button>

      {isExpanded && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          ...(isMobile && {
            maxHeight: '60vh',
            overflowY: 'auto',
            paddingRight: '1rem'
          })
        }}>
          {steps.map((step, index) => {
            const isComplete = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div 
                key={step.path}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isComplete ? 'var(--hover-color)' : 
                                 isCurrent ? 'var(--secondary-color)' : 'transparent',
                  border: '2px solid var(--secondary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: (isComplete || isCurrent) ? 'white' : 'var(--secondary-color)',
                  transition: 'all 0.3s ease'
                }}>
                  {isComplete ? '✓' : step.icon}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <span style={{
                    color: isCurrent ? 'var(--primary-color)' : 'var(--text-color)',
                    fontWeight: isCurrent ? '600' : '400',
                    opacity: isComplete ? 0.7 : 1
                  }}>
                    {step.label}
                  </span>
                  
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-color)',
                    opacity: 0.7
                  }}>
                    {isComplete ? 'Completed' : `Est: ${step.estimatedTime}`}
                  </span>

                  {isMobile && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-color)',
                      opacity: 0.7,
                      marginTop: '0.25rem'
                    }}>
                      {step.tooltip}
                    </span>
                  )}
                </div>

                {!isMobile && (
                  <div style={{
                    position: 'absolute',
                    left: '100%',
                    marginLeft: '1rem',
                    backgroundColor: '#2d3748',
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 101
                  }}>
                    {step.tooltip}
                  </div>
                )}

                {index < steps.length - 1 && (
                  <div style={{
                    width: '2px',
                    height: '24px',
                    backgroundColor: isComplete ? 'var(--hover-color)' : 'var(--secondary-color)',
                    opacity: isComplete ? 1 : 0.3,
                    position: 'absolute',
                    left: '31px',
                    transform: 'translateY(28px)',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkflowStepper;