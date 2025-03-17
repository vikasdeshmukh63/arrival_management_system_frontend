import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { useBrands } from '@/hooks/useBrands'
import { useCategories } from '@/hooks/useCategories'
import { useColors } from '@/hooks/useColors'
import { useSizes } from '@/hooks/useSizes'
import { useStyles } from '@/hooks/useStyles'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useEffect, useState, useCallback } from 'react'
import { ArrowDown10, ArrowUp10 } from 'lucide-react'
import { EArrivalStatus } from '@/constants/constants'

export function FilterToolbar({
    enableBrands,
    enableColors,
    enableSizes,
    enableStyles,
    enableCategories,
    status
}: {
    enableBrands?: boolean
    enableColors?: boolean
    enableSizes?: boolean
    enableStyles?: boolean
    enableCategories?: boolean
    status?: boolean
}) {
    // hooks
    const { data: brands } = useBrands()
    const { data: colors } = useColors()
    const { data: sizes } = useSizes()
    const { data: styles } = useStyles()
    const { data: categories } = useCategories()

    // search params
    const [searchParams, setSearchParams] = useSearchParams()

    // state
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
    const [order, setOrder] = useState(searchParams.get('order') || 'asc')

    // handle search
    const handleSearch = () => {
        if (searchInput.trim()) {
            setSearchParams((prev) => {
                prev.set('search', searchInput)
                return prev
            })
        } else {
            setSearchParams((prev) => {
                prev.delete('search')
                return prev
            })
        }
    }

    // handle filter click
    const handleFilterClick = useCallback(
        (type: string, id: number | string) => {
            setSearchParams((prev) => {
                prev.set(type.toLowerCase(), id.toString())
                return prev
            })
        },
        [setSearchParams]
    )

    // handle clear filters
    const handleClearFilters = () => {
        const page = searchParams.get('page')
        const itemsPerPage = searchParams.get('itemsPerPage')

        const newParams = new URLSearchParams()
        if (page) newParams.set('page', page)
        if (itemsPerPage) newParams.set('itemsPerPage', itemsPerPage)

        setSearchParams(newParams)
        setSearchInput('')
    }

    // handle order
    useEffect(() => {
        if (order) {
            handleFilterClick('order', order)
        }
    }, [handleFilterClick, order])

    return (
        <div className="flex items-center justify-between gap-2 flex-wrap md:flex-nowrap">
            {/* search */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Input
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch()
                        }
                    }}
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>

            {/* filter */}
            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                <Menubar>
                    {/* brands */}
                    {enableBrands && (
                        <MenubarMenu>
                            <MenubarTrigger>Brands</MenubarTrigger>
                            <MenubarContent>
                                {brands?.items?.map((brand) => (
                                    <MenubarItem
                                        key={brand.brand_id}
                                        onClick={() => handleFilterClick('brand', brand.brand_id)}>
                                        {brand.name}
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    )}

                    {/* colors */}
                    {enableColors && (
                        <MenubarMenu>
                            <MenubarTrigger>Colors</MenubarTrigger>
                            <MenubarContent>
                                {colors?.items?.map((color) => (
                                    <MenubarItem
                                        key={color.color_id}
                                        onClick={() => handleFilterClick('color', color.color_id)}>
                                        {color.name}
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    )}

                    {/* sizes */}
                    {enableSizes && (
                        <MenubarMenu>
                            <MenubarTrigger>Sizes</MenubarTrigger>
                            <MenubarContent>
                                {sizes?.items?.map((size) => (
                                    <MenubarItem
                                        key={size.size_id}
                                        onClick={() => handleFilterClick('size', size.size_id)}>
                                        {size.name}
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    )}

                    {/* styles */}
                    {enableStyles && (
                        <MenubarMenu>
                            <MenubarTrigger>Styles</MenubarTrigger>
                            <MenubarContent>
                                {styles?.items?.map((style) => (
                                    <MenubarItem
                                        key={style.style_id}
                                        onClick={() => handleFilterClick('style', style.style_id)}>
                                        {style.name}
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    )}

                    {/* categories */}
                    {enableCategories && (
                        <MenubarMenu>
                            <MenubarTrigger>Categories</MenubarTrigger>
                            <MenubarContent>
                                {categories?.items?.map((category) => (
                                    <MenubarItem
                                        key={category.category_id}
                                        onClick={() => handleFilterClick('category', category.category_id)}>
                                        {category.name}
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    )}

                    {/* status */}
                    {status && (
                        <MenubarMenu>
                            <MenubarTrigger>Status</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={() => handleFilterClick('status', EArrivalStatus.UPCOMING)}>
                                    {EArrivalStatus.UPCOMING}
                                </MenubarItem>
                                <MenubarItem onClick={() => handleFilterClick('status', EArrivalStatus.IN_PROGRESS)}>
                                    {EArrivalStatus.IN_PROGRESS}
                                </MenubarItem>
                                <MenubarItem onClick={() => handleFilterClick('status', EArrivalStatus.FINISHED)}>
                                    {EArrivalStatus.FINISHED}
                                </MenubarItem>
                                <MenubarItem onClick={() => handleFilterClick('status', EArrivalStatus.COMPLETED_WITH_DISCREPANCY)}>
                                    {EArrivalStatus.COMPLETED_WITH_DISCREPANCY}
                                </MenubarItem>
                                <MenubarItem onClick={() => handleFilterClick('status', EArrivalStatus.NOT_INITIATED)}>
                                    {EArrivalStatus.NOT_INITIATED}
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    )}

                    {/* order */}
                    <MenubarMenu>
                        {order === 'asc' ? (
                            <MenubarTrigger onClick={() => setOrder('desc')}>
                                <ArrowUp10 />
                            </MenubarTrigger>
                        ) : (
                            <MenubarTrigger onClick={() => setOrder('asc')}>
                                <ArrowDown10 />
                            </MenubarTrigger>
                        )}
                    </MenubarMenu>
                </Menubar>

                {/* clear filters */}
                <Button
                    variant="outline"
                    onClick={handleClearFilters}>
                    Clear Filters
                </Button>
            </div>
        </div>
    )
}
