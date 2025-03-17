import { createContext, useContext, useEffect, useState } from 'react'

// types
type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

// initial state
const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null
}

// create context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme', ...props }: ThemeProviderProps) {
    // state
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme)

    // use effect
    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    // value
    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        }
    }

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

// use theme
export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
