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
    return <div className="text-center py-10 text-gray-400">Loading reviews...</div>
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Failed to load reviews.</div>
  }

  return (
    <div className={clsx("w-full p-5 bg-[#1b1321] border border-[#3f2e40] rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all", className)}>
      <h2 className="text-xl font-semibold text-purple-300 mb-3">Product Reviews:</h2>

      {/* Scrollable container */}
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
        {memoizedReviews.length === 0 ? (
          <p className="text-white text-sm">No reviews yet.</p>
        ) : (
          memoizedReviews.map((review: any) => (
            <div key={review._id} className="border-b border-[#3f2e40] pb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{review.user?.userName || "Anonymous"}</span>
                <span className="text-xs text-gray-400">{review.formattedDate}</span>
              </div>
              <div className="flex items-center my-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300">{review.comment}</p>
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
                "px-3 py-1 rounded border text-sm transition",
                page === i + 1
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-[#2a1e30] text-purple-300 border-[#3f2e40] hover:bg-[#3a2a40]"
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
