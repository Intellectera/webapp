import * as React from "react";

export default function ThreeDotsLoading() {
    return (
        <div className='flex justify-center items-center h-8 mx-auto'>
            <span className='sr-only'>Loading...</span>
            <div
                className='h-3 w-3 mx-1 bg-gray-500 rounded-full animate-bounce duration-700 [animation-delay:-0.3s]'></div>
            <div
                className='h-3 w-3 mx-1 bg-gray-500 rounded-full animate-bounce duration-700 [animation-delay:-0.15s]'></div>
            <div className='h-3 w-3 mx-1 bg-gray-500 rounded-full animate-bounce duration-700'></div>
        </div>
    )
}
