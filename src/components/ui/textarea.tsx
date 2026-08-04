import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  legend?: React.ReactNode;
  fieldsetClassName?: string;
};

function Textarea({
  className,
  fieldsetClassName,
  legend,
  id,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  return (
    <fieldset
      className={cn(
        `
          min-w-0
          rounded-lg
          border
          border-gray-400/70
          focus-within:border-gray-400
          px-2.5
          pb-2
          transition-colors    
          disabled:pointer-events-none
          has-[textarea:disabled]:bg-input/50
          has-[textarea:disabled]:opacity-50
          has-[textarea[aria-invalid=true]]:border-destructive
          has-[textarea[aria-invalid=true]]:ring-3
          has-[textarea[aria-invalid=true]]:ring-destructive/20
        `,
        fieldsetClassName,
      )}
    >
      {legend && (
        <legend className="px-1 text-sm text-gray-400">
          <label htmlFor={textareaId}>{legend}</label>
        </legend>
      )}

      <textarea
        id={textareaId}
        data-slot="textarea"
        className={cn(
          `
            block
            min-h-24
            w-full
            resize-none
            appearance-none
            border-0
            bg-transparent
            px-0
            py-1
            text-base
            outline-none
            placeholder:text-muted-foreground
            disabled:cursor-not-allowed
            md:text-sm
          `,
          className,
        )}
        {...props}
      />
    </fieldset>
  );
}

export { Textarea };