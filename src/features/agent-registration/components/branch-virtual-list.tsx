import {
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";

type BranchOption = {
  label: string;
  value: string;
};

const BranchVirtualizedList = ({ options }: { options: BranchOption[] }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    getItemKey: (index) => options[index]?.value ?? index,
    estimateSize: () => 32,
    overscan: 8,
  });

  if (options.length === 0) {
    return (
      <>
        <ComboboxEmpty>شعبه‌ای پیدا نشد</ComboboxEmpty>
        <ComboboxList />
      </>
    );
  }

  return (
    <ComboboxList ref={parentRef} className="relative">
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const option = options[virtualItem.index];

          return (
            <div
              key={option.value}
              className="absolute left-0 top-0 w-full"
              style={{
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ComboboxItem index={virtualItem.index} value={option}>
                {option.label}
              </ComboboxItem>
            </div>
          );
        })}
      </div>
    </ComboboxList>
  );
};

export default BranchVirtualizedList;
