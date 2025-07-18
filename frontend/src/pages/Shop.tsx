import ProductCard from "@/components/features/ProductCard";
import {
  useGetProductsByCategoriesQuery,
  useSearchProductsQuery,
} from "@/redux/api/productApi";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Skeleton from "@/components/ui/Skeleton";

function Shop() {
  const navigate = useNavigate();
  const searchQuery = useSearchParams()[0];
  const { data: categoryData } = useGetProductsByCategoriesQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState(100000);

  const handleNavigate = (id: string): void => {
    navigate(`/product/${id}`);
  };
  console.log("data",categoryData)
  const { data, isLoading, isError } = useSearchProductsQuery({
    search,
    category,
    sort,
    price,
    page,
  });

  const products = data?.products || [];
  const totalPage = data?.totalPage || 1;

  const isPrevPage = page > 1;
  const isNextPage = page < totalPage;

  if (isError)
    return (
      <div className="text-3xl text-gray-500 text-center mt-10">
        Failed to fetch data!
      </div>
    );

  return isLoading ? (
    <Skeleton />
  ) : (
    <div className="min-h-screen pt-24 px-6 text-white flex gap-6">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col items-center rounded-2xl bg-[#1b1321] shadow-xl border border-[#3f2e40] px-4 py-6">
        <h1 className="text-2xl font-semibold text-purple-300 mb-6">Filters</h1>

        <label className="text-sm text-white mb-1 self-start">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-[#2a1e30] text-white border border-gray-500 rounded px-2 py-1 mb-4"
        >
          <option value="">All</option>
          {categoryData?.products.map((i) => (
            <option value={i} key={i}>
              {i}
            </option>
          ))}
        </select>

        <div className="w-full my-4">
          <label className="text-sm text-white mb-1 block">
            Max Price: ₹{price}
          </label>
          <input
            type="range"
            value={price}
            min={100}
            max={100000}
            className="w-full accent-purple-500"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <label className="text-sm text-white mb-1 self-start">Sort</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-[#2a1e30] text-white border border-gray-500 rounded px-2 py-1"
        >
          <option value="">None</option>
          <option value="asc">Price (low to high)</option>
          <option value="dsc">Price (high to low)</option>
        </select>
      </aside>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full max-w-sm bg-[#2a1e30] text-white border border-gray-500 rounded px-4 py-2 placeholder-gray-400"
          />
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((i) => (
            <ProductCard
            stock={i.stock}
              key={i._id}
              onClick={() => handleNavigate(i._id)}
              name={i.name}
              category={i.category}
              price={i.price}
              ratings={i.ratings || 0}
              photo={i.photo}
            />
          ))}
        </main>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-6">
          <button
            className="text-white px-4 py-1 rounded hover:text-blue-400 disabled:opacity-30"
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span className="text-gray-300 text-sm">
            {page} of {data?.totalPage || 1}
          </span>
          <button
            className="text-white px-4 py-1 rounded hover:text-blue-400 disabled:opacity-30"
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Shop;
