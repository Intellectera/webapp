import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Locale
import './i18n.ts'
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {ErrorBoundary} from "react-error-boundary";


const getErrorDisplay = () => {
    return (
        <div className={'h-screen w-screen bg-gray-400 flex justify-center items-center'}>
            <h1 className={'text-white'}>Something Went Wrong</h1>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorBoundary fallback={getErrorDisplay()}>
        <HelmetProvider>
            <BrowserRouter>
                <Suspense>
                    <App />
                </Suspense>
            </BrowserRouter>
        </HelmetProvider>
    </ErrorBoundary>
)
