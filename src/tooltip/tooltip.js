import "./tooltip.css";

export function Tooltip({ label, items }) {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <span className="tooltip">
      {/* Visible trigger */}
      <span className="tooltip-label">{label}</span>

      {/* Tooltip content */}
      <span className="tooltip-content">
        {hasItems ? (
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <span>{label}</span>
        )}
      </span>
    </span>
  );
}