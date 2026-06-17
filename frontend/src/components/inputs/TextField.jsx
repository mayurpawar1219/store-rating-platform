function TextField({ label, type = "text", value, onChange, placeholder, ...rest }) {
  // Generate a clean unique ID from the label text
  const inputId = label ? label.toLowerCase().replace(/[^a-z0-9]/g, "-") : undefined;

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="field__input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

export default TextField;
