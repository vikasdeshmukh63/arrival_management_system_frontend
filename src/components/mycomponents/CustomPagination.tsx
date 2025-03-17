import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'
import { CONSTANTS } from '@/constants/constants'
import { Pagination as PaginationType } from '@/lib/products'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function CustomPagination({ pagination }: { pagination: PaginationType }) {
    // navigate hook
    const navigate = useNavigate()

    // pagination
    const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination

    // changing page
    const handleChangePage = (newPage: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('page', newPage.toString())
        params.set('itemsPerPage', CONSTANTS.ITEM_PER_PAGE.toString())
        navigate(`${window.location.pathname}?${params.toString()}`)
    }

    // update url
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        params.set('page', currentPage.toString())
        params.set('itemsPerPage', CONSTANTS.ITEM_PER_PAGE.toString())
        navigate(`${window.location.pathname}?${params.toString()}`)
    }, [currentPage, navigate])

    return (
        <Pagination>
            <PaginationContent>
                {/* previous page */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => handleChangePage(currentPage - 1)}
                        className={!hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>

                {/* pages */}
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1

                    // show ellipsis for large page numbers
                    if (totalPages > 7) {
                        if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleChangePage(pageNumber)
                                        }}
                                        isActive={currentPage === pageNumber}>
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )
                        }
                        return null
                    }

                    // show all pages if total pages are 7 or less
                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleChangePage(pageNumber)
                                }}
                                isActive={currentPage === pageNumber}>
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                {/* next page */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => handleChangePage(currentPage + 1)}
                        className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
