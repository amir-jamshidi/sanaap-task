import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-emerald-600" />
        ),
        info: (
          <InfoIcon className="size-5 text-primary-600" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 text-amber-600" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-600" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-gray-500" />
        ),
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#374151",
          "--normal-border": "#e5e7eb",
          "--success-bg": "#ecfdf5",
          "--success-text": "#065f46",
          "--success-border": "#a7f3d0",
          "--error-bg": "#fef2f2",
          "--error-text": "#991b1b",
          "--error-border": "#fecaca",
          "--warning-bg": "#fffbeb",
          "--warning-text": "#92400e",
          "--warning-border": "#fde68a",
          "--info-bg": "#ecfeff",
          "--info-text": "#0e7490",
          "--info-border": "#a5f3fc",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "font-sans group toast group-[.toaster]:min-h-14 group-[.toaster]:items-start group-[.toaster]:gap-3 group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:text-right group-[.toaster]:shadow-xl group-[.toaster]:shadow-gray-950/10 group-[.toaster]:backdrop-blur",
          title:
            "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:leading-6",
          description:
            "group-[.toast]:mt-0.5 group-[.toast]:text-xs group-[.toast]:leading-5 group-[.toast]:opacity-80",
          icon: "group-[.toast]:mt-0.5 group-[.toast]:shrink-0",
          closeButton:
            "group-[.toast]:left-2 group-[.toast]:right-auto group-[.toast]:top-2 group-[.toast]:rounded-md group-[.toast]:border-gray-200 group-[.toast]:bg-white group-[.toast]:text-gray-400 group-[.toast]:shadow-sm group-[.toast]:transition-colors hover:group-[.toast]:text-gray-700",
          actionButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-primary-500 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-gray-100 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:text-gray-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
