import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-mono font-medium text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-surface border rounded-cyber text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : "border-border"
          } ${className}`}
          {...props}
        />
        {helperText && !error && <p className="text-xs text-muted font-mono">{helperText}</p>}
        {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-mono font-medium text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full px-3.5 py-2.5 bg-surface border rounded-cyber text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : "border-border"
          } ${className}`}
          {...props}
        />
        {helperText && !error && <p className="text-xs text-muted font-mono">{helperText}</p>}
        {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
