import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
    group/button
    inline-flex
    shrink-0
    items-center
    justify-center
    rounded-lg
    border
    border-transparent
    text-sm
    font-medium
    whitespace-nowrap
    transition-all
    outline-none
    select-none
    disabled:pointer-events-none
    disabled:opacity-50
    cursor-pointer
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-primary-500
          text-white
          hover:bg-primary-600
          focus-visible:ring-3
          focus-visible:ring-primary-500/30
        `,

        ghost: `
          bg-transparent
          text-gray-600
          hover:bg-gray-100
          hover:text-gray-900
          focus-visible:ring-3
          focus-visible:ring-gray-400/20
        `,
      },

      size: {
        default: "h-12 gap-2 px-6",
        sm: "h-9 gap-1.5 px-4 text-sm",
        lg: "h-14 gap-2 px-8 text-base",
        icon: "size-12",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
