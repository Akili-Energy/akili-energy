import { HTMLAttributes } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function TooltipText({
  values,
  maxLength = 1,
  className,
}: HTMLAttributes<HTMLElement> & { values: string[]; maxLength?: number }) {
  if (values.length > maxLength) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={cn(
                maxLength > 1 ? "text-sm" : "text-xs",
                "text-gray-600 cursor-help",
                className
              )}
            >
              Multiple
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 bg-white rounded border border-gray-200 shadow-sm p-2">
              {values.map((region) => (
                <div key={region} className="flex items-center">
                  <span>{region}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn(maxLength > 1 ? "font-medium" : "truncate", className)}>
      {values.join(", ")}
    </div>
  );
}
