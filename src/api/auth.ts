export async function login() {
  window.location.href = "http://localhost:5000/auth/login";
}

export async function logout() {
  await fetch("http://localhost:5000/auth/logout");
}
