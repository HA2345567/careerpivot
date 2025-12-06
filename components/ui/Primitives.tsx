import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] border border-white/10",
      glow: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/5",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-white/20",
      ghost: "hover:bg-white/5 hover:text-white"
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 py-3 text-base"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'success' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: "border-transparent bg-primary text-white hover:bg-primary/80 shadow-[0_0_10px_-3px_hsl(var(--primary)/0.4)]",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground border-border",
    success: "border-transparent bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "border-transparent bg-amber-500/10 text-amber-400 border border-amber-500/20"
  }
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div
      className={`rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-md shadow-xl ${hoverEffect ? 'hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-500' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, centered = true }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
      {title}
    </h2>
    {subtitle && <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);
