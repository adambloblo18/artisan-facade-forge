import { Suspense, useEffect, useState, type ReactNode } from "react";

/**
 * Renders fallback during SSR and the first client render, then mounts children
 * after hydration. Combined with React.lazy, this avoids SSR/CSR mismatch while
 * still deferring below-the-fold component code from the initial HTML payload.
 */
export default function DeferMount({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <>{fallback}</>;
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
