import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useIsAuthenticated = () =>
  useAppSelector((s) => s.auth.status === "authenticated");

export const useUser = () => useAppSelector((s) => s.auth.user);
