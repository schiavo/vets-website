import React from 'react';

export default function LoadingButton({
  isLoading,
  children,
  onClick,
  disabled,
  ...props
}) {
  const contents = isLoading ? (
    <i className="fa fa-spinner fa-spin" />
  ) : (
    children
  );
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      onClick={onClick}
      className="usa-button"
    >
      {contents}
    </button>
  );
}
