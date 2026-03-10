
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(circle);

    setTimeout(() => {
        circle.remove();
    }, 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (props.onClick) {
      props.onClick(e);
    }
  };
  
  const baseClasses = 'relative overflow-hidden px-5 py-2.5 rounded-lg font-mono font-semibold text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 focus:ring-primary hover:shadow-[0_0_15px_theme(colors.primary)]', // Violet
    secondary: 'bg-secondary hover:bg-secondary/90 focus:ring-secondary hover:shadow-[0_0_15px_theme(colors.secondary)]', // Electric Blue
    accent: 'bg-accent hover:bg-accent/90 focus:ring-accent hover:shadow-[0_0_15px_theme(colors.accent)]', // Emerald
    danger: 'bg-danger hover:bg-danger/90 focus:ring-danger hover:shadow-[0_0_15px_theme(colors.danger)]', // Red
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
