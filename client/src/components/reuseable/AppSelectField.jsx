import React from "react";
import Select from "react-select";

export default function AppSelectField({
  options,
  selectChange,
  name,
  value,
  placeholder,
}) {
  return (
    <Select
      options={options}
      onChange={selectChange}
      name={name}
      value={value}
      placeholder={placeholder}
      theme={(theme) => ({
        ...theme,
        borderRadius: 2,
        colors: {
          ...theme.colors,
          primary: "black",
          neutral20: "black",
        },
      })}
      styles={{
        control: (base, state) => ({
          ...base,
          height: 42,
          minHeight: 42,
          width: "100%",
          paddingLeft: 2,
          borderColor: state.isFocused ? "black" : "#D0D0C8",
          color: "black",
          backgroundColor: "transparent",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#D0D0C8",
          paddingLeft: 1,
        }),
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
}
