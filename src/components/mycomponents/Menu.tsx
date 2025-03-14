import {
    Building2,
    HandHeart,
    Home,
    Layers2,
    LayoutDashboard,
    LogOut,
    Package,
    Palette,
    SquareRoundCorner,
    SquareSigma,
    Target,
    Truck
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { ModeToggle } from './mode-toggle'

const menuItems = [
    {
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/dashboard'
    },
    {
        label: 'Arrivals',
        icon: <Truck className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/arrivals'
    },
    {
        label: 'Products',
        icon: <Package className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/products'
    },
    {
        label: 'Brands',
        icon: <Target className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/brands'
    },
    {
        label: 'Categories',
        icon: <Layers2 className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/categories'
    },
    {
        label: 'Colors',
        icon: <Palette className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/colors'
    },
    {
        label: 'Conditions',
        icon: <HandHeart className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/conditions'
    },
    {
        label: 'Size',
        icon: <SquareSigma className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/sizes'
    },
    {
        label: 'Styles',
        icon: <SquareRoundCorner className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/styles'
    },
    {
        label: 'Suppliers',
        icon: <Building2 className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/suppliers'
    },
    {
        label: 'Logout',
        icon: <LogOut className="w-6 md:w-8 h-6 md:h-8" />,
        href: '/logout'
    }
]

const Menu = () => {
    return (
        <div className="text-md">
            <Link to="/dashboard">
                <img
                    src="./logo.svg"
                    alt="logo"
                    className="h-full"
                />
            </Link>

            <div className="mt-4 flex flex-col gap-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.href}
                        className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-black hover:text-white dark:hover:bg-gray-800 ${
                            item.href === window.location.pathname ? 'bg-black text-white dark:bg-gray-800' : ''
                        }`}>
                        {item.icon}
                        <span className="hidden md:block">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Menu
