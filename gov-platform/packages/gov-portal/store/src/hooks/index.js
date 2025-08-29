import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useIsAuthenticated = () =>
  useAppSelector((s) => s.auth.status === "authenticated");

export const useUser = () => useAppSelector((s) => s.auth.user);

export const useFormSession = () => useAppSelector((s) => s.form.formSession);
export const useDraftByKey = (key) => useAppSelector((s) => s.form.drafts[key]);
export const useFeatureFlag = (flag) => useAppSelector((s) => !!s.form.featureFlags[flag]);