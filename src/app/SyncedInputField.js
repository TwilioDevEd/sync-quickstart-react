import React from "react";

export default function SyncedInputField({
  setFormValue,
  formDataKey,
  formDataValue,
  placeholder,
}) {
  return (
    <input
      onBlur={(e) => {
        setFormValue(formDataKey, e.target.value);
      }}
      id={formDataKey}
      type="text"
      onChange={(e) => {
        setFormValue(formDataKey, e.target.value);
      }}
      value={formDataValue}
      className="form-control cb-input"
      placeholder={placeholder}
    />
  );
}
