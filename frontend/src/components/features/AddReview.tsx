import { useAddReviewMutation } from "@/redux/api/ReviewApi";
import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

type propsType = {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
};

function AddReview({ productId, isOpen, onClose }: propsType) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [addReview, { isLoading, isError }] = useAddReviewMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await addReview({ productId: productId, comment, rating });
      if (res.data?.success) {
        toast.success(res.data?.message || "review added!");
        isOpen = false;
      }
    } catch (error: any) {
      console.log("failed to add review:", error);
      toast.error(error.data?.message || "failed to add review!");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    max-w-[500px] w-full h-[400px]  sm:min-h-[300px] bg-[#a49ea9] text-black 
    shadow-lg rounded-lg p-6 "
    >
      {isError ? (
        <div className="w-full text-center text-2xl text-red-700">failed to add reviews!</div>
      ) : (
        <div>
          <span className="w-full flex justify-end ">
            <button
              onClick={onClose}
              className=" hover:cursor-pointer hover:text-red-600 ease-in-out duration-150"
            >
              <X />
            </button>
          </span>
          <div>
            <div className="w-full flex justify-center">
              <span className="text-[25px]  text-center">
                Add Your Reviews !
              </span>
            </div>
            <form
              className="h-full w-full flex flex-col   gap-2   "
              onSubmit={handleSubmit}
            >
              <textarea
                className="w-full h-[100px] bg-gray-100 rounded-[5px] mt-4 p-2"
                placeholder="add comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-100"
                    } hover:scale-110 transition-transform`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="flex justify-center">
                <button className="bg-slate-800 min-w-[50px] text-white px-3 py-2 rounded-[8px] hover:bg-slate-600 ease-in-out duration-200 border-[1px] border-transparent hover:border-black">
                  {isLoading ? "Submiting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddReview;
