// pages/success.tsx
import { useRouter } from 'next/router';
import { FC } from 'react';

const SuccessPage: FC = () => {
  const router = useRouter();
  const { subdomain } = router.query;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Domain Configuration Successful</h1>
      <p>
        Domain <strong>{subdomain}.oono.store</strong> is successfully configured.
      </p>
    </div>
  );
};

export default SuccessPage;
