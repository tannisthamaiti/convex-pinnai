// components/RequireAuth.jsx
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

// Wrap any element in <RequireAuth> … </RequireAuth>
// and it will only render when the Clerk user is signed-in.
export default function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  // 1) Wait until Clerk finishes loading user data
  if (!isLoaded) return null;            // or return a spinner

  // 2) If signed-in → show protected content
  if (isSignedIn) return children;

  // 3) Otherwise bounce back to Landing
  //    `replace` keeps history tidy; `state` preserves where they came from.
  return <Navigate to="/" replace state={{ from: location }} />;
}
