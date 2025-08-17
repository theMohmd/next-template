"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils/shadcn";

const inputVariants = cva(
  "flex w-full rounded-md transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        filled:
          "border-0 bg-muted/50 hover:bg-muted/70 focus-visible:bg-background",
        border:
          "border border-input bg-background hover:border-input/80 focus-visible:border-ring",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      state: {
        default: "",
        success: "border-green-500 focus-visible:ring-green-500/20",
        error: "border-red-500 focus-visible:ring-red-500/20",
      },
    },
    defaultVariants: {
      variant: "border",
      size: "default",
      state: "default",
    },
  },
);

const helperTextVariants = cva("text-sm mt-1", {
  variants: {
    state: {
      default: "text-muted-foreground",
      success: "text-green-600",
      error: "text-red-600",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showCharacterCount?: boolean;
    readOnly?: boolean;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      variant,
      size,
      state,
      label,
      helperText,
      leftIcon,
      rightIcon,
      showCharacterCount = false,
      maxLength,
      value,
      className,
      readOnly = false,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = React.useId();

    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;
    const charCount = value?.toString().length || 0;

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon || isPassword;

    const getInputPadding = () => {
      const leftPadding = hasLeftIcon
        ? size === "sm"
          ? "pl-9"
          : size === "lg"
            ? "pl-12"
            : "pl-10"
        : "";
      const rightPadding = hasRightIcon
        ? size === "sm"
          ? "pr-9"
          : size === "lg"
            ? "pr-12"
            : "pr-10"
        : "";
      return cn(leftPadding, rightPadding);
    };

    if (readOnly) {
      return (
        <div className="space-y-1">
          {label && (
            <label className="text-foreground text-sm font-medium">
              {label}
            </label>
          )}
          <div
            className={cn(
              inputVariants({ variant, size, state }),
              getInputPadding(),
              "cursor-default",
              className,
            )}
          >
            {hasLeftIcon && (
              <div
                className={cn(
                  "text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2",
                  size === "sm" && "left-2 size-4",
                  size === "lg" && "left-4 size-5",
                  !size && "size-4",
                )}
              >
                {leftIcon}
              </div>
            )}
            <span className="flex-1">{value || props.placeholder}</span>
            {hasRightIcon && (
              <div
                className={cn(
                  "text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2",
                  size === "sm" && "right-2 size-4",
                  size === "lg" && "right-4 size-5",
                  !size && "size-4",
                )}
              >
                {rightIcon}
              </div>
            )}
          </div>
          {(helperText || (showCharacterCount && maxLength)) && (
            <div className="flex items-center justify-between">
              {helperText && (
                <p className={helperTextVariants({ state })}>{helperText}</p>
              )}
              {showCharacterCount && maxLength && (
                <span className="text-muted-foreground text-xs tabular-nums">
                  {charCount}/{maxLength}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-foreground text-sm font-medium"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {hasLeftIcon && (
            <div
              className={cn(
                "text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2",
                size === "sm" && "left-2 size-4",
                size === "lg" && "left-4 size-5",
                !size && "size-4",
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={actualType}
            value={value}
            maxLength={maxLength}
            className={cn(
              inputVariants({ variant, size, state }),
              getInputPadding(),
              className,
            )}
            {...props}
          />

          {hasRightIcon && (
            <div
              className={cn(
                "absolute top-1/2 right-3 -translate-y-1/2",
                size === "sm" && "right-2",
                size === "lg" && "right-4",
              )}
            >
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    size === "sm" && "size-4",
                    size === "lg" && "size-5",
                    !size && "size-4",
                  )}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              ) : (
                <div
                  className={cn(
                    "text-muted-foreground",
                    size === "sm" && "size-4",
                    size === "lg" && "size-5",
                    !size && "size-4",
                  )}
                >
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>

        {(helperText || (showCharacterCount && maxLength)) && (
          <div className="flex items-center justify-between">
            {helperText && (
              <p className={helperTextVariants({ state })}>{helperText}</p>
            )}
            {showCharacterCount && maxLength && (
              <span className="text-muted-foreground text-xs tabular-nums">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
