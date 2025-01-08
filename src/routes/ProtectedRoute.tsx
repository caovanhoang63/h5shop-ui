import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore.ts";

export const CheckRole = (
  allowedRoles: string[],
  Component: React.ComponentType,
): React.ReactNode => {
  const userProfile = useUserStore((state) => state.user);
  const token = localStorage.getItem("token");

  if (!token || !userProfile?.systemRole) {
    return <Navigate to="/login" />;
  } else if (!allowedRoles.includes(userProfile.systemRole)) {
    return <Navigate to="/notfound" />;
  }
  return <Component />;
};
