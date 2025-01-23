import {Helmet} from 'react-helmet-async';
// sections
import {RecoverPasswordView} from './../../../sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RecoverPage() {
  return (
    <>
      <Helmet>
        <title>Intellectera</title>
      </Helmet>

      <RecoverPasswordView />
    </>
  );
}
