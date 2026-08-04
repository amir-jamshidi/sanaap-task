"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  LoaderCircle,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const ComboboxAnchorContext =
  React.createContext<React.RefObject<HTMLDivElement | null> | null>(
    null,
  );

const ComboboxDisabledContext =
  React.createContext(false);

function Combobox<
  Value,
  Multiple extends boolean | undefined = false,
>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>,
) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const isDisabled = Boolean(props.disabled);

  return (
    <ComboboxDisabledContext.Provider value={isDisabled}>
      <ComboboxAnchorContext.Provider value={anchorRef}>
        <ComboboxPrimitive.Root {...props} />
      </ComboboxAnchorContext.Provider>
    </ComboboxDisabledContext.Provider>
  );
}

function ComboboxValue({
  ...props
}: ComboboxPrimitive.Value.Props) {
  return (
    <ComboboxPrimitive.Value
      data-slot="combobox-value"
      {...props}
    />
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        `
          outline-none!
          ring-0!
          shadow-none!
          focus:outline-none!
          focus:ring-0!
          focus:shadow-none!
          focus-visible:outline-none!
          focus-visible:ring-0!
          focus-visible:shadow-none!
          [&_svg:not([class*='size-'])]:size-4
        `,
        className,
      )}
      {...props}
    >
      {children}

      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({
  className,
  ...props
}: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={
        <InputGroupButton
          variant="ghost"
          size="icon-xs"
        />
      }
      className={cn(
        `
          text-gray-400
          outline-none!
          ring-0!
          shadow-none!
          hover:bg-transparent
          focus:outline-none!
          focus:ring-0!
          focus-visible:outline-none!
          focus-visible:ring-0!
        `,
        className,
      )}
      {...props}
    >
      <XIcon className="pointer-events-none size-4" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled: disabledProp,
  showTrigger = true,
  showClear = false,
  error,
  isLoading,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
  error?: string;
  isLoading?: boolean;
}) {
  const anchorRef = React.useContext(
    ComboboxAnchorContext,
  );

  const rootDisabled = React.useContext(
    ComboboxDisabledContext,
  );

  const disabled = disabledProp ?? rootDisabled;

  return (
    <div className="relative w-full pb-6">
      <div ref={anchorRef} className="w-full">
        <InputGroup
          data-error={error ? "" : undefined}
          data-disabled={disabled ? "" : undefined}
          className={cn(
            `
              h-12
              w-full
              rounded-lg
              border
              border-gray-400/70
              bg-transparent
              px-2

              outline-none!
              ring-0!
              shadow-none!

              focus-within:border-primary-500
              focus-within:outline-none!
              focus-within:ring-0!
              focus-within:shadow-none!

              has-[[data-slot=input-group-control]:focus]:outline-none!
              has-[[data-slot=input-group-control]:focus]:ring-0!
              has-[[data-slot=input-group-control]:focus]:shadow-none!

              has-[[data-slot=input-group-control]:focus-visible]:border-primary-500
              has-[[data-slot=input-group-control]:focus-visible]:outline-none!
              has-[[data-slot=input-group-control]:focus-visible]:ring-0!
              has-[[data-slot=input-group-control]:focus-visible]:shadow-none!

              has-aria-invalid:outline-none!
              has-aria-invalid:ring-0!
              has-aria-invalid:shadow-none!

              data-error:border-red-500
              data-error:focus-within:border-red-500

              data-disabled:cursor-not-allowed
              data-disabled:bg-input/50
              data-disabled:opacity-50
            `,
            className,
          )}
        >
          <ComboboxPrimitive.Input
            render={
              <InputGroupInput disabled={disabled} />
            }
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            className={cn(
              `
                h-full
                min-w-0
                flex-1
                bg-transparent
                p-0
                text-sm
                text-gray-700
                placeholder:text-gray-400

                outline-none!
                ring-0!
                shadow-none!

                focus:outline-none!
                focus:ring-0!
                focus:shadow-none!

                focus-visible:outline-none!
                focus-visible:ring-0!
                focus-visible:shadow-none!

                aria-invalid:outline-none!
                aria-invalid:ring-0!
                aria-invalid:shadow-none!

                disabled:cursor-not-allowed
                disabled:bg-transparent!
                disabled:text-gray-500
                disabled:opacity-100
              `,
            )}
            {...props}
          />

          <InputGroupAddon
            align="inline-end"
            className="
              outline-none!
              ring-0!
              shadow-none!
            "
          >
            {isLoading ? (
              <LoaderCircle className="pointer-events-none size-5 animate-spin text-gray-500" />
            ) : showTrigger && (
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                render={<ComboboxTrigger />}
                data-slot="input-group-button"
                className="
                  text-gray-400
                  outline-none!
                  ring-0!
                  shadow-none!
                  hover:bg-transparent
                  focus:outline-none!
                  focus:ring-0!
                  focus-visible:outline-none!
                  focus-visible:ring-0!
                  data-pressed:bg-transparent
                  group-has-data-[slot=combobox-clear]/input-group:hidden
                "
                disabled={disabled}
              />
            )}

            {!isLoading && showClear && (
              <ComboboxClear disabled={disabled} />
            )}
          </InputGroupAddon>

          {children}
        </InputGroup>
      </div>

      {error && (
        <span
          role="alert"
          className="absolute bottom-0 right-0 text-xs text-red-500"
        >
          {error}
        </span>
      )}
    </div>
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "anchor"
  >) {
  const internalAnchor = React.useContext(
    ComboboxAnchorContext,
  );

  const resolvedAnchor = anchor ?? internalAnchor;

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={resolvedAnchor}
        className="isolate z-50 w-[var(--anchor-width)]"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={Boolean(anchor)}
          className={cn(
            `
              group/combobox-content
              w-full
              overflow-hidden
              rounded-lg
              border
              border-gray-300
              bg-white
              text-foreground
              shadow-lg
              origin-top
              transition-all
              duration-150
              ease-out

              outline-none!
              ring-0!

              focus:outline-none!
              focus:ring-0!

              focus-visible:outline-none!
              focus-visible:ring-0!

              data-open:animate-in
              data-open:fade-in-0
              data-open:zoom-in-95

              data-closed:animate-out
              data-closed:fade-out-0
              data-closed:zoom-out-95
            `,
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        `
          scrollbar-none
          max-h-64
          overflow-x-hidden
          overflow-y-auto
          overscroll-contain
          scroll-py-1
          p-1
          outline-none!
          ring-0!
          data-empty:p-0
        `,
        className,
      )}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        `
          relative
          flex
          h-8
          w-full
          cursor-default
          select-none
          items-center
          gap-1.5
          rounded-md
          py-1
          pr-8
          pl-1.5
          text-sm
          text-gray-600

          outline-none!
          ring-0!
          shadow-none!

          hover:bg-gray-200

          focus:outline-none!
          focus:ring-0!
          focus:shadow-none!

          focus-visible:outline-none!
          focus-visible:ring-0!
          focus-visible:shadow-none!

          data-highlighted:bg-gray-200
          data-highlighted:text-gray-600
          data-highlighted:outline-none!
          data-highlighted:ring-0!
          data-highlighted:shadow-none!

          data-disabled:pointer-events-none
          data-disabled:opacity-50

          [&_svg]:pointer-events-none
          [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
        `,
        className,
      )}
      {...props}
    >
      <span className="flex flex-1 gap-2 whitespace-nowrap">
        {children}
      </span>

      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  );
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxCollection({
  ...props
}: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection
      data-slot="combobox-collection"
      {...props}
    />
  );
}

function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-border",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<
  typeof ComboboxPrimitive.Chips
> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        `
          flex
          min-h-8
          flex-wrap
          items-center
          gap-1
          rounded-lg
          border
          border-input
          bg-transparent
          bg-clip-padding
          px-2.5
          py-1
          text-sm

          outline-none!
          ring-0!
          shadow-none!

          focus-within:outline-none!
          focus-within:ring-0!
          focus-within:shadow-none!

          has-aria-invalid:outline-none!
          has-aria-invalid:ring-0!
          has-aria-invalid:shadow-none!

          has-data-[slot=combobox-chip]:px-1
        `,
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
        className,
      )}
      {...props}
    >
      {children}

      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={
            <Button variant="ghost" size="sm" />
          }
          className="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        `
          min-w-16
          flex-1
          outline-none!
          ring-0!
          shadow-none!
          focus:outline-none!
          focus:ring-0!
          focus-visible:outline-none!
          focus-visible:ring-0!
        `,
        className,
      )}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
};
