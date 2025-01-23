
import {Helmet} from 'react-helmet-async';
// sections
import {ForgetPasswordView} from './../../../sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Intellectera</title>
      </Helmet>

      <ForgetPasswordView />
    </>
  );
}
