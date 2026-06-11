export const isRequired = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== "";

export const isEmail = (value) =>
  /^\S+@\S+\.\S+$/.test(String(value || ""));

export const isPhone = (value) =>
  /^\d{10,15}$/.test(String(value || ""));

const toInputDate = (value) => {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
};

export const validateBookingForm = (form, options = {}) => {
  const {
    selectedBatch = null,
    batchesAvailable = false,
  } = options;
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

  if (batchesAvailable && !selectedBatch) {
    errors.batch = "Select a departure batch to continue";
  }

  if (selectedBatch) {
    const batchStart = toInputDate(selectedBatch.start_date);
    const batchEnd = toInputDate(selectedBatch.end_date);

    if (!batchStart || !batchEnd) {
      errors.batch = "Selected batch is missing travel dates";
    } else if (form.departure !== batchStart) {
      errors.departure = "Travel start date must match the selected batch";
    } else if (form.returnDate !== batchEnd) {
      errors.returnDate = "Travel end date must match the selected batch";
    }
  } else {
    if (!isRequired(form.departure)) {
      errors.departure = "Departure date is required";
    }

    if (!isRequired(form.returnDate)) {
      errors.returnDate = "Return date is required";
    } else if (
      isRequired(form.departure) &&
      form.returnDate < form.departure
    ) {
      errors.returnDate = "Return date cannot be before departure date";
    }
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
