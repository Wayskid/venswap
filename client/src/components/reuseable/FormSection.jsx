import React from "react";

export default function FormSection({ children, className, guide }) {
  return (
    <div
      className={`grid md:flex items-end gap-3 border-b py-8 ${
        className ? className : "items-end"
      }`}
    >
      <div className="grid gap-2 md:w-2/3">{children}</div>
      <p className="md:w-1/3 text-sm">{guide}</p>
    </div>
  );
}
