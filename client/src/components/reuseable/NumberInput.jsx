import React from "react";

export default function NumberInput({
  name,
  value,
  onChange,
  onBlur,
  onFocus,
}) {
  return (
    <div className="flex">
      <p className="mr-1">&#8358;</p>
      <input
        type="text"
        className="font-medium outline-none"
        id={name}
        name={name}
        required
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        pattern="^\d{1,3}(?:,\d{3})*$"
      />
    </div>
  );
}
