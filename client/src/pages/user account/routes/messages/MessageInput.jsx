import React, { useEffect, useRef } from "react";

export default function MessageInput({
  handleChange,
  name,
  placeholder,
  required,
  value,
  readOnly,
  className
}) {
  const textAreaRef = useRef(null);

  //Auto size textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [value, textAreaRef]);

  return (
    <div className={className}>
      <textarea
        name={name}
        ref={textAreaRef}
        rows={1}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={handleChange}
        className={`outline-none focus:placeholder:text-transparent resize-none`}
        readOnly={readOnly}
      ></textarea>
    </div>
  );
}
