"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "../language-context";

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type DatePickerInputProps = {
  onDateChange?: (date: Date | undefined) => void;
  value?: Date | undefined;
  id?: string;
  required?: boolean;
  endMonth?: Date;
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export function DatePickerInput({
  id,
  onDateChange,
  value: defaultValue,
  required,
  endMonth,
}: DatePickerInputProps) {
  // const { language } = useLanguage();

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);
  const [month, setMonth] = React.useState<Date | undefined>(date);

  // function formatDate(date: Date | undefined) {
  //   if (!date) {
  //     return "";
  //   }

  //   return date.toLocaleDateString(language, {
  //     day: "2-digit",
  //     month: "long",
  //     year: "numeric",
  //   });
  // }

  const [value, setValue] = React.useState(formatDate(date));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id={id}
          name={id}
          value={value}
          required={required}
          placeholder="January 01, 1970"
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(date)) {
              setDate(date);
              setMonth(date);
              onDateChange?.(date);
            } else {
              onDateChange?.(undefined);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              endMonth={endMonth}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                setOpen(false);
                onDateChange?.(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
