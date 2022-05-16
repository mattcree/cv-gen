import React from "react";

interface FormWithButtonProps {
  fieldId: string;
  value: string;
  onInput: (input: string) => void;
  placeholder: string;
  label: string;
  buttonLabel: string;
  required: boolean;
  onBlur?: () => void;
  onEnter?: () => void;
  onClick: () => void;
}

const FormFieldWithButton: React.FC<FormWithButtonProps> = ({
  fieldId,
  value,
  onInput,
  placeholder,
  label,
  required,
  onEnter,
  onBlur,
  onClick,
  buttonLabel
}) => {
  return (
    <div className="my-3">
      <label htmlFor={fieldId}>{label}</label>
      <div className="input-group mb-3">
        <input
          type="text"
          id={fieldId}
          value={value}
          className="form-control"
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={(e) => onInput(e.currentTarget.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onEnter?.();
            }
          }}
          aria-label={label}
          required={required}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={onClick}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormFieldWithButton;
