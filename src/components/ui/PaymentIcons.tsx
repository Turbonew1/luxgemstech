export function PaymentIcons() {
  const icons = [
    { label: "Visa", color: "bg-blue-600" },
    { label: "Mastercard", color: "bg-red-500" },
    { label: "Amex", color: "bg-blue-500" },
    { label: "PayPal", color: "bg-blue-700" },
    { label: "Alipay", color: "bg-blue-400" },
    { label: "WeChat", color: "bg-green-500" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {icons.map(({ label, color }) => (
        <span
          key={label}
          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium text-white ${color}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
