import React from "react";

interface FormProps {
  fieldId: string;
  value: string;
  onInput: (input: string) => void;
  placeholder: string;
  label: string;
  required: boolean;
  onBlur: () => void;
  onEnter?: () => void;
}

const FormField: React.FC<FormProps> = ({
  fieldId,
  value,
  onInput,
  placeholder,
  label,
  required,
  onEnter,
  onBlur
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={fieldId}>{label}</label>
      <input
        type="text"
        className="form-control"
        id={fieldId}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInput(e.currentTarget.value)}
        onBlur={onBlur}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onEnter?.();
          }
        }}
        required={required}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  );
};

export default FormField;
