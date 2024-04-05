import React from "react";

const Input = React.forwardRef(
  ({ name, type, label, errors, ...rest }, ref) => {
    const hasError = errors[name];
    return (
      <div className="relative">
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900 font-intel"
        >
          {label}
        </label>
        <div className="mt-2">
          <input
            id={name}
            autoComplete={name}
            name={name}
            type={type || "text"}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm font-inter ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset !focus:ring-orange-500 sm:text-sm sm:leading-6"
            ref={ref}
            {...rest}
          />
        </div>
        {hasError && (
          <p className="pt-1 absolute text-rose-500 text-sm">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
