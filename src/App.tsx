// main style
import './index.css'

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// routes
import Router from "./routes/sections";

// theme
import ThemeProvider from './theme';
// hooks
import { useScrollToTop } from './hooks/use-scroll-to-top';
// components
import ProgressBar from './components/progress-bar';
import MotionLazy from './components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from './components/settings';
// auth
import { AuthProvider, AuthConsumer } from './auth/context/jwt';

// ----------------------------------------------------------------------

export default function App() {
    console.log(`
                                                                                                                                                              
88  888b      88  888888888888  88888888888  88           88           88888888888  ,ad8888ba,  888888888888  88888888888  88888888ba          db         
88  8888b     88       88       88           88           88           88          d8"'    \`"8b      88       88           88      "8b        d88b        
88  88 \`8b    88       88       88           88           88           88         d8'                88       88           88      ,8P       d8'\`8b       
88  88  \`8b   88       88       88aaaaa      88           88           88aaaaa    88                 88       88aaaaa      88aaaaaa8P'      d8'  \`8b      
88  88   \`8b  88       88       88"""""      88           88           88"""""    88                 88       88"""""      88""""88'       d8YaaaaY8b     
88  88    \`8b 88       88       88           88           88           88         Y8,                88       88           88    \`8b      d8""""""""8b    
88  88     \`8888       88       88           88           88           88          Y8a.    .a8P      88       88           88     \`8b    d8'        \`8b   
88  88      \`888       88       88888888888  88888888888  88888888888  88888888888  \`"Y8888Y"'       88       88888888888  88      \`8b  d8'          \`8b  
                                                                                                                                                          
    `);
    useScrollToTop();

    return (
        <AuthProvider>
            <SettingsProvider
                defaultSettings={{
                    themeMode: 'light', // 'light' | 'dark'
                    themeDirection: 'ltr', //  'rtl' | 'ltr'
                    themeContrast: 'default', // 'default' | 'bold'
                    themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                    themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                    themeStretch: false,
                }}
            >
                <ThemeProvider>
                    <MotionLazy>
                        <SettingsDrawer />
                        <ProgressBar />
                        <AuthConsumer>
                            <Router />
                        </AuthConsumer>
                    </MotionLazy>
                </ThemeProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}
