import React from 'react'
import Menu from '../Menu'
import { ModeToggle } from '../mode-toggle'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-screen h-screen flex">
            {/* sidebar */}
            <div className="w-1/5 md:w-1/6 h-full p-4 relative border-r border-gray-200 dark:border-gray-800">
                {/* menu */}
                <Menu />
                {/* mode toggle */}
                <ModeToggle className="absolute bottom-4 left-4" />
            </div>
            {/* content */}
            <div className="w-4/5 md:w-5/6 h-full overflow-hidden overflow-y-auto">{children}</div>
        </div>
    )
}

export default Layout
