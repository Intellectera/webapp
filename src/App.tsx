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
import { SettingsProvider } from './components/settings';
// auth
import { AuthProvider, AuthConsumer } from './auth/context/jwt';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function App() {
    useScrollToTop();

    useEffect(() => {
        console.log(`

            ██╗███╗   ██╗████████╗███████╗██╗     ██╗     ███████╗ ██████╗████████╗███████╗██████╗  █████╗
            ██║████╗  ██║╚══██╔══╝██╔════╝██║     ██║     ██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔══██╗
            ██║██╔██╗ ██║   ██║   █████╗  ██║     ██║     █████╗  ██║        ██║   █████╗  ██████╔╝███████║
            ██║██║╚██╗██║   ██║   ██╔══╝  ██║     ██║     ██╔══╝  ██║        ██║   ██╔══╝  ██╔══██╗██╔══██║
            ██║██║ ╚████║   ██║   ███████╗███████╗███████╗███████╗╚██████╗   ██║   ███████╗██║  ██║██║  ██║
            ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
            `)
    }, [])

    return (
        <AuthProvider>
            <SettingsProvider
                defaultSettings={{
                    themeMode: 'dark', // 'light' | 'dark'
                    themeDirection: 'ltr', //  'rtl' | 'ltr'
                    themeContrast: 'default', // 'default' | 'bold'
                    themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                    themeColorPresets: 'blue', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                    themeStretch: false,
                }}
            >
                <ThemeProvider>
                    <MotionLazy>
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
