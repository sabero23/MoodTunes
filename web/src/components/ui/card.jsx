// src/components/ui/card.jsx
export function Card({ children, className = '' }) {
    return (
      <div className={`rounded-xl border bg-white shadow-md dark:bg-gray-800 dark:border-gray-700 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children }) {
    return <div className="border-b px-6 py-4 dark:border-gray-700">{children}</div>;
  }
  
  export function CardTitle({ children }) {
    return <h2 className="text-xl font-bold text-gray-900 dark:text-white">{children}</h2>;
  }
  
  export function CardDescription({ children }) {
    return <p className="text-sm text-gray-600 dark:text-gray-300">{children}</p>;
  }
  
  export function CardContent({ children }) {
    return <div className="px-6 py-4">{children}</div>;
  }
  
  export function CardFooter({ children }) {
    return <div className="border-t px-6 py-4 dark:border-gray-700">{children}</div>;
  }
  