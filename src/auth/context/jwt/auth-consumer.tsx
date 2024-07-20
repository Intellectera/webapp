//
import {AuthContext} from './auth-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  return (
    <AuthContext.Consumer>
      {(_) => (children)}
    </AuthContext.Consumer>
  );
}
