import React from "react";

export default function AppButtons({
  label,
  className,
  isDisabled,
  onClick,
  type,
}) {
  return (
    <button
      className={`px-4 py-3 text-lg font-bold ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
}

export function AppButtonsSecondary({
  label,
  className,
  onClick,
  type,
  isDisabled,
}) {
  return (
    <button
      className={`px-3 py-2 font-semibold ${className}`}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
}
