import { redirect } from "react-router";

const checkAuth = () => {
  const isAuthenticated = true;
  return isAuthenticated;
}

export const protectedLoader = async () => {
  const isAuth = await checkAuth();
  if (!isAuth) throw redirect("/auth/login");
  return null
}