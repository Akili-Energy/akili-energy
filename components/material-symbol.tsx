import * as React from "react";
import { cn } from "@/lib/utils";

export function MaterialSymbol({
  name,
  iconStyle = "outlined",
  weight,
  fill,
  opsz,
  grade,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  iconStyle?: "outlined" | "rounded" | "sharp";
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  fill?: boolean;
  opsz?: 20 | 24 | 40 | 48;
  grade?: -25 | 0 | 200;
}) {
  const fontVariationSettings = [];
  if (fill !== undefined) fontVariationSettings.push(`'FILL' ${fill ? 1 : 0}`);
  if (weight) fontVariationSettings.push(`'wght' ${weight}`);
  if (grade !== undefined) fontVariationSettings.push(`'GRAD' ${grade}`);
  if (opsz) fontVariationSettings.push(`'opsz' ${opsz}`);

  return (
    <span
      className={cn(
        iconStyle === "rounded"
          ? "material-symbols-rounded"
          : iconStyle === "sharp"
          ? "material-symbols-sharp"
          : "material-symbols-outlined",
        className
      )}
      style={
        fontVariationSettings && {
          fontVariationSettings: fontVariationSettings.join(", "),
        }
      }
      {...props}
    >
      {name}
    </span>
  );
}
