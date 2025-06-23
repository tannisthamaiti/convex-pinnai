import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function LoginPage() {
  const { loginWithRedirect, isLoading, error } = useAuth0();

  useEffect(() => {
    console.log("LoginPage useEffect firing");
    loginWithRedirect(); // 🟢 This MUST fire
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h2>Redirecting to login...</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
}
