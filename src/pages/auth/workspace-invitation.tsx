import {Helmet} from 'react-helmet-async';
import { WorkspaceInvitationView } from '../../sections/auth';
// sections

// ----------------------------------------------------------------------

export default function WorkspaceInvitationPage() {
  return (
    <>
      <Helmet>
        <title>Intellectera</title>
      </Helmet>

      <WorkspaceInvitationView />
    </>
  );
}
