"use client";

import { useEffect, useState } from 'react';

const SuccessPage = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname; // Get the hostname
      const parts = hostname.split('.'); // Split hostname by '.'

      // If there are at least three parts, we assume the first is the subdomain
      if (parts.length >= 3) {
        setSubdomain(parts[0]); // Set the first part as subdomain
      } else {
        setSubdomain(null); // No subdomain detected
      }
    }
  }, []); // Run only once on mount

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Domain Configuration Successful</h1>
      {subdomain ? (
        <p>
          Domain <strong>{subdomain}.oono.store</strong> is successfully configured.
        </p>
      ) : (
        <p>No subdomain detected.</p>
      )}
    </div>
  );
};

export default SuccessPage;
