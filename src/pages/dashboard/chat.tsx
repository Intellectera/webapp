import {Helmet} from 'react-helmet-async';
// sections
import ChatView from './../../sections/chat/view';

// ----------------------------------------------------------------------

export default function ChatPage() {
    return (
        <>
            <Helmet>
                <title>Chat</title>
            </Helmet>

            <ChatView />
        </>
    );
}
