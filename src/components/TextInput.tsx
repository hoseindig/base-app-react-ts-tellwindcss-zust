// components/TextInput.tsx
import { ChangeEvent } from "react";

type TextInputProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
};

const TextInput = ({
  value,
  placeholder,
  onChange,
  type = "text",
}: TextInputProps) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="
        border border-gray-300 rounded-md px-3 py-2
        hover:border-gray-400
        focus:border-blue-500 focus:ring-2 focus:ring-blue-200
        outline-none transition
      "
    />
  );
};

export default TextInput;
