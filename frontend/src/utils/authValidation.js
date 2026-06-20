const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export function validateLoginForm(formData) {
  const email = formData.email.trim();

  if (!email || !formData.password) {
    return "Email and password are required.";
  }

  if (!emailRegex.test(email)) {
    return "A valid email address is required.";
  }

  return "";
}

export function validateRegisterForm(formData) {
  const name = formData.name.trim();
  const email = formData.email.trim();

  if (!name || !email || !formData.password) {
    return "Name, email, and password are required.";
  }

  if (!emailRegex.test(email)) {
    return "A valid email address is required.";
  }

  if (formData.password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!passwordRegex.test(formData.password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
  }

  return "";
}
