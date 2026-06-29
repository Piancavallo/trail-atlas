import { useCallback, useState } from 'react'

/**
 * Resets to page 1 whenever filterKey changes, without a separate effect.
 */
export function useFilterPagination(filterKey: string) {
  const [pagination, setPagination] = useState({ filterKey, page: 1 })

  const page = pagination.filterKey === filterKey ? pagination.page : 1

  const setPage = useCallback(
    (nextPage: number) => {
      setPagination({ filterKey, page: nextPage })
    },
    [filterKey],
  )

  const resetPagination = useCallback(() => {
    setPagination({ filterKey: '', page: 1 })
  }, [])

  return { page, setPage, resetPagination }
}
