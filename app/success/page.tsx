"use client";

import { useUrl } from "nextjs-current-url";

const SuccessPage = () => {
  const { href: currentUrl } = useUrl() ?? {};

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Domain Configuration Successful</h1>
      {currentUrl ? (
        <p>
          Domain <strong>{currentUrl}.oono.store</strong> is successfully
          configured.
        </p>
      ) : (
        <p>No subdomain detected because of window. d:{currentUrl}</p>
      )}
    </div>
  );
};

export default SuccessPage;
