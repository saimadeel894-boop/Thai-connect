import { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        className="h-4 w-4 rounded border-gray-800 bg-black text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
        {...props}
      />
      <label htmlFor={id} className="ml-2 text-sm text-white">
        {label}
      </label>
    </div>
  );
}
