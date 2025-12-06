import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function InputPanel({ title, description, children, className }: InputPanelProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn("glass-card p-5", className)}
    >
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-gradient">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
}

interface InputFieldProps {
  label: string;
  type?: 'text' | 'number';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}

export function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="input-field"
      />
    </div>
  );
}

interface InputButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function InputButton({ 
  onClick, 
  children, 
  disabled,
  variant = 'primary' 
}: InputButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-3 rounded-lg font-medium transition-all duration-200",
        variant === 'primary'
          ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
          : "bg-muted/50 text-foreground hover:bg-muted/70",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
