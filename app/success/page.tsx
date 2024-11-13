"use client";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      setSubdomain(window.location.hostname);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Domain Configuration Successful</h1>
      {subdomain ? (
        <p>
          Domain <strong>{subdomain}</strong> is successfully
          configured.
        </p>
      ) : (
        <p> Domain <strong>{window.location.hostname}</strong> is successfully
          configured.</p>
      )}
    </div>
  );
};

export default SuccessPage;
