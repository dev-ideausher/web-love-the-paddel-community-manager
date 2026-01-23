"use client";

import { cn } from "@/Utilities/cn";
import Input from "../Input";
import { Label } from "../label";

export function InputWithLabel({
  type,
  iconType,
  name,
  placeholder = "enter here",
  className,
  labelClass,
  inputClass,
  children,
  ...props
}) {
  return (
    <div
      className={cn("grid w-full max-w-sm items-center  gap-1.5 ", className)}
    >
      <Label
        htmlFor={`label-${name}`}
        className={cn("text-sm text-black   font-medium -mb-1 ", labelClass)}
      >
        {name}
      </Label>
      <div className="flex items-center gap-2 px-2 bg-white border rounded-lg">
        {iconType === "pre" && <div>{children}</div>}
        <Input
          type={type}
          id={`label-${name}`}
          name={name}
          placeholder={placeholder}
          className={cn(
            "outline-none border-none p-0   bg-white focus:bg-white active:bg-white h-12",
            inputClass
          )}
          {...props}
        />
        {iconType === "post" && <div>{children}</div>}
      </div>
    </div>
  );
}
