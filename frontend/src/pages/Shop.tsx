import { useGetProductsByCategoriesQuery, useSearchProductsQuery } from '@/redux/api/productApi'
import type { Product } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function Shop() {
  const searchQuery = useSearchParams()[0]
  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useGetProductsByCategoriesQuery()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(searchQuery.get('category') || "")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)
  const [price, setPrice] = useState(10000)

  const { data, isLoading, isError } = useSearchProductsQuery({ search, category, sort, price, page })


  useEffect(() => {
    console.log("data:", data)
    console.log("category", categoryData)
  }, [data])

  return (
    <div className='min-h-[calc(100vh)] overflow-y-hidden flex bg-white pt-20 px-4 text-white '>
      <aside className='flex  justify-start my-2 items-center flex-col bg-white w-[250px] border-none border-gray-300 h-[700px] shadow-2xl shadow-black-200'>
        <h1 className=' mt-2 mb-10 text-3xl text-blue-400'>FILTERS</h1>
        <span className='text-black text-[14px] mb-2'>CATEGORY</span>
        <select name="category" className='text-black w-[200px] hover:bg-gray-400 border-black' value={category} onChange={(e) => setCategory(e.target.value)} >
          <option value="">all</option>
          {
            categoryData?.products.map(i=>(
              <option value={i} key={i}>
                {
                  i
                }
              </option>
            ))
          }
        </select>
        <div className='w-full h-full ml-40 mt-5 p-2 fles flex-col justify-center items-center'>
          <h3 className='text-black'>price</h3>
          <input type="range" value={40} min={100} max={10000} />
        </div>
      </aside>
      <main className='w-full h-full ml-3 bg-none'>

      </main>
    </div>
  )
}

export default Shop