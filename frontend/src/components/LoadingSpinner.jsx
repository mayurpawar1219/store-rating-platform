function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <div className="spinner__dot" />
      <span className="spinner__label">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
