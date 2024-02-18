export const getToken = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const tokenParam = params.get("token");

  const isTokenInUrl = tokenParam;
  const isTokenInLocalStorage = localStorage.getItem("session");

  if (isTokenInUrl) {
    localStorage.setItem("session", tokenParam);
    window.location.replace(window.location.origin);
    return tokenParam;
  } else if (isTokenInLocalStorage) {
    return localStorage.getItem("session");
  }

  return null;
};
