import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Input({
  className,
  type,
  dir,
  isLoading,
  isError,
  isSuccess,
  error,
  statusTooltip,
  wrapperClassName,
  isLtrContent = false,
  ...props 
}: React.ComponentProps<"input"> & {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  error?: string;
  statusTooltip?: string;
  wrapperClassName?: string;
  isLtrContent?:boolean
}) {
  return (
    <div className={cn("relative w-full pb-6", wrapperClassName)}>
      <InputPrimitive
        type={type}
        dir={isLtrContent? "rtl" : dir}
        data-slot="input"
        className={cn(
          "h-12 w-full min-w-0 rounded-lg text-gray-700 border border-gray-400/70 bg-transparent px-2.5 py-1 focus:border-primary-500 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:border-ring disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          isLtrContent &&
            "text-left [&::placeholder]:text-right [&::placeholder]:[direction:rtl]",
          { "border-red-500": Boolean(error) },
          className,
        )}
        {...props}
      />

      {isLoading && (
        <LoaderCircle className="pointer-events-none absolute left-3 top-1/3 size-5 -translate-y-1/2 animate-spin text-gray-500" />
      )}

      {!isLoading && isError && (
        <InputStatusIcon
          tooltip={statusTooltip}
          icon={<CircleX className="size-5 text-red-500" />}
        />
      )}

      {!isLoading && !isError && isSuccess && (
        <InputStatusIcon
          tooltip={statusTooltip}
          icon={<CircleCheck className="size-5 text-green-600" />}
        />
      )}
      
      {error && (
        <span className="text-xs text-red-500 absolute bottom-0 right-0">
          {error}
        </span>
      )}
    </div>
  );
}

function InputStatusIcon({
  icon,
  tooltip,
}: {
  icon: React.ReactNode;
  tooltip?: string;
}) {
  if (!tooltip) {
    return (
      <span className="pointer-events-none absolute left-3 top-1/3 -translate-y-1/2">
        {icon}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        closeOnClick={false}
        render={
          <button
            type="button"
            aria-label={tooltip}
            className="absolute left-3 top-1/3 -translate-y-1/2"
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent dir="rtl">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { Input };
