import { cva, VariantProps } from "class-variance-authority";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils/shadcn";

import { Label } from "./label";

const inputVariants = cva(
  [
    "placeholder:text-muted-foreground flex w-full min-w-0 rounded-md text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    // "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "selection:bg-primary selection:text-primary-foreground",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        outline: "bg-transparent border-input border ",
        filled: "bg-input/50 ",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);
export type InputProps = Omit<React.ComponentProps<"input">, "type" | "size"> &
  VariantProps<typeof inputVariants> & {
    type?: "file" | "number" | "password" | "text";
    label?: string;
  };

function InputBase({ className, variant, size, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function PasswordInput({
  isPassword,
  children,
  inputClassName,
}: {
  isPassword: boolean;
  children: React.ReactElement<InputProps>;
  inputClassName?: string;
}) {
  const child = React.Children.only(children);
  const [hidden, setHidden] = React.useState(true);

  return !isPassword ? (
    children
  ) : (
    <div className="relative">
      {React.cloneElement(child, {
        className: cn(inputClassName, "pr-11"),
        type: hidden ? "password" : "text",
      })}
      <button
        className="absolute top-0 right-3 bottom-0 hover:-translate-y-0.25 active:translate-y-0 [&>*]:size-4"
        onClick={() => setHidden((p) => !p)}
      >
        {hidden ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
}

function InputWithLabel({
  label,
  children,
}: Pick<InputProps, "label"> & { children: React.ReactElement<InputProps> }) {
  const id = React.useId();
  const child = React.Children.only(children);
  return !label ? (
    children
  ) : (
    <div className="grid w-full items-center gap-3 ">
      <Label htmlFor={id}>{label}</Label>
      {React.cloneElement(child, { id })}
    </div>
  );
}

function Input({ label, type, ...props }: InputProps) {
  return (
    <InputWithLabel label={label}>
      <PasswordInput
        isPassword={type === "password"}
        inputClassName={props.className}
      >
        <InputBase {...props} {...{ type }} />
      </PasswordInput>
    </InputWithLabel>
  );
}

export { Input };
