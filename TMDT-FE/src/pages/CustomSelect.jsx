import { Select, SelectItem } from "@heroui/react";

export default function CustomSelect({
  label,
  placeholder,
  options = [],
  value,
  onChange,
  name,
  error,
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <Select
        label={label}
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const selectedValue = Array.from(keys)[0];
          onChange(selectedValue);
        }}
        name={name}
        variant="bordered"
      >
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
