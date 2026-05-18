export const isRequired = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== "";

export const isEmail = (value) =>
  /^\S+@\S+\.\S+$/.test(String(value || ""));

export const isPhone = (value) =>
  /^\d{10,15}$/.test(String(value || ""));

export const validateBookingForm = (form) => {
  const errors = {};

  if (!isRequired(form.firstName)) {
    errors.firstName = "First name is required";
  }

  if (!isRequired(form.lastName)) {
    errors.lastName = "Last name is required";
  }

  if (!isEmail(form.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!isPhone(form.phone)) {
    errors.phone = "Enter a valid phone number";
  }

  return errors;
};

export const validatePackageForm = (form) => {
  const errors = {};

  ["title", "destination", "duration", "description"].forEach((field) => {
    if (!isRequired(form[field])) {
      errors[field] = "Required";
    }
  });

  if (Number(form.price) < 0 || !isRequired(form.price)) {
    errors.price = "Enter a valid price";
  }

  return errors;
};

export const validateLoginForm = (form) => {
  const errors = {};

  if (!isEmail(form.email)) {
    errors.email = "Enter a valid email";
  }

  if (!isRequired(form.password)) {
    errors.password = "Password is required";
  }

  return errors;
};
