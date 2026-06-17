import TextField from "./TextField";

function PasswordField({ label, value, onChange, placeholder, ...rest }) {
  return (
    <TextField
      label={label}
      type="password"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export default PasswordField;
