export default function Input({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-3 py-2 border rounded-lg shadow-sm focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   ${
                     error
                       ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                       : "border-gray-300"
                   }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
