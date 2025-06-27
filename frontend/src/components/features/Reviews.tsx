import { useGetProductReviewsQuery } from '@/redux/api/ReviewApi'
import React, { useState, useMemo, useCallback } from 'react'
import { Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

type ReviewsProps = {
  id: string
  className?: string
}

const Reviews: React.FC<ReviewsProps> = ({ id, className }) => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useGetProductReviewsQuery({ id, page })

  const reviews = data?.reviews || []
  const totalPages = data?.totalPage || 1

  const memoizedReviews = useMemo(() => {
    return reviews.map((review: any) => ({
      ...review,
      formattedDate: formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
    }))
  }, [reviews])

  const handlePageChange = useCallback((pageNumber: number) => {
    setPage(pageNumber)
  }, [])

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading reviews...</div>
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Failed to load reviews.</div>
  }

  return (
    <div className={clsx("w-full p-5 bg-white shadow rounded", className)}>
      <h2 className="text-xl font-semibold mb-3">Product Reviews</h2>

      {/* Scrollable container */}
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
        {memoizedReviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          memoizedReviews.map((review: any) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{review.user?.userName || "Anonymous"}</span>
                <span className="text-xs text-gray-500">{review.formattedDate}</span>
              </div>
              <div className="flex items-center my-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={clsx(
                "px-3 py-1 rounded border text-sm",
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-400 hover:bg-blue-50"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reviews
