// src/components/ui/button.jsx
export function Button({ children, onClick, className = '', variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    icon: 'p-2 rounded-full',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded font-medium shadow-sm transition ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}