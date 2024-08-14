import {Helmet} from 'react-helmet-async';
// sections
import {JwtRegisterView} from './../../../sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Intellectera: Register</title>
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
