import {Helmet} from 'react-helmet-async';
// sections
import FourView from './../../sections/four/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Four</title>
      </Helmet>

      <FourView />
    </>
  );
}
