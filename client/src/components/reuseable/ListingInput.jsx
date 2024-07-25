import React from "react";

export default function ListingInput({
  type,
  name,
  id,
  label,
  value,
  onChange,
  guide,
  required,
  max,
  readOnly,
}) {
  return (
    <div className="grid border-b py-8">
      <label htmlFor={id} className="text-lg font-medium mb-2">
        {label}
      </label>
      <div className="grid md:flex gap-2">
        <input
          type={type}
          name={name}
          id={id}
          maxLength={max}
          value={value}
          onChange={onChange}
          className={`border border-gray-400 focus:border-Orange outline-none text-lg bg-transparent p-2  rounded-sm w-full md:w-2/3 shrink-0 self-center`}
          required={required}
          readOnly={readOnly}
        />
        <p className="text-sm self-center text-gray-600 ">{guide}</p>
      </div>
    </div>
  );
}
