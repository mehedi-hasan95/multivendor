"use client";

import { HexColorInput, HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value?: string;
  onPickerChange: (color: string) => void;
}
export const ColorPicker = ({ value, onPickerChange }: ColorPickerProps) => {
  return (
    <div className="relative">
      <HexColorPicker
        color={value}
        onChange={onPickerChange}
        className="mb-5"
      />
      <div className="flex items-center gap-2">
        <div className="relative">
          <p
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 rounded-full"
            style={{ backgroundColor: value }}
          ></p>
          <p className="absolute left-10 top-1/2 -translate-y-1/2 font-bold">
            #
          </p>
          <HexColorInput
            color={value}
            onChange={onPickerChange}
            className="hex-input border pl-12 py-2 font-bold"
          />
        </div>
      </div>
    </div>
  );
};
