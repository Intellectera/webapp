import {Helmet} from 'react-helmet-async';
// sections
import {JwtLoginView} from './../../../sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Intellectera: Login</title>
      </Helmet>

      <JwtLoginView />
    </>
  );
}
