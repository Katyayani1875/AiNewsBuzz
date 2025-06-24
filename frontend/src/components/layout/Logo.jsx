// src/components/layout/Logo.jsx
export const Logo = () => (
    <div className="flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad_page" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <pattern id="circuitPattern" patternUnits="userSpaceOnUse" width="4" height="4">
                    <path d="M0 0H4V4" stroke="currentColor" strokeWidth="0.5" fill="none" />
                </pattern>
            </defs>
            
            {/* Base shape - Modern news/mic combined with AI circuit */}
            <path 
                d="M20 8C28.8366 8 36 15.1634 36 24C36 32.8366 28.8366 40 20 40C11.1634 40 4 32.8366 4 24C4 15.1634 11.1634 8 20 8Z" 
                fill="url(#grad_page)" 
                fillOpacity="0.1"
            />
            
            {/* Abstract microphone with circuit pattern */}
            <path 
                d="M20 12C24.4183 12 28 15.5817 28 20V24C28 28.4183 24.4183 32 20 32C15.5817 32 12 28.4183 12 24V20C12 15.5817 15.5817 12 20 12Z" 
                fill="none" 
                stroke="url(#grad_page)" 
                strokeWidth="2"
            />
            
            {/* Circuit lines inside mic */}
            <path 
                d="M20 16V24M16 20H24" 
                stroke="url(#grad_page)" 
                strokeWidth="1.5" 
                strokeLinecap="round"
            />
            
            {/* Neural network nodes */}
            <circle cx="20" cy="20" r="1.5" fill="url(#grad_page)" />
            <circle cx="16" cy="16" r="1" fill="url(#grad_page)" />
            <circle cx="24" cy="16" r="1" fill="url(#grad_page)" />
            <circle cx="16" cy="24" r="1" fill="url(#grad_page)" />
            <circle cx="24" cy="24" r="1" fill="url(#grad_page)" />
            
            {/* Connecting lines */}
            <path d="M20 20L16 16" stroke="url(#grad_page)" strokeWidth="0.8" strokeOpacity="0.7" />
            <path d="M20 20L24 16" stroke="url(#grad_page)" strokeWidth="0.8" strokeOpacity="0.7" />
            <path d="M20 20L16 24" stroke="url(#grad_page)" strokeWidth="0.8" strokeOpacity="0.7" />
            <path d="M20 20L24 24" stroke="url(#grad_page)" strokeWidth="0.8" strokeOpacity="0.7" />
            
            {/* Sound waves/radar effect */}
            <path 
                d="M20 8V4M20 36V40M4 20H0M40 20H36M8.686 8.686L6.343 6.343M33.657 33.657L31.314 31.314M8.686 31.314L6.343 33.657M33.657 6.343L31.314 8.686" 
                stroke="url(#grad_page)" 
                strokeWidth="0.8" 
                strokeOpacity="0.4"
            />
        </svg>   
    </div>
);