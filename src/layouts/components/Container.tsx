import { ReactNode } from "react";

export default function Container({
  children,
  className = " ",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`h-full p-5 ${className}`}>{children}</div>;
}
