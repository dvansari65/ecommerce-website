import ProductCard from '@/components/features/ProductCard'
import { useGetProductsByCategoriesQuery, useSearchProductsQuery } from '@/redux/api/productApi'
import  {  useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Shop() {
  const navigate = useNavigate()
  const searchQuery = useSearchParams()[0]
  const { data: categoryData } = useGetProductsByCategoriesQuery()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(searchQuery.get('category') || "")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)
  const [price, setPrice] = useState(100000)

  const handleNavigate = (id:string):void=>{
    navigate(`/product/${id}`)
  }

  const { data, isLoading, isError } = useSearchProductsQuery({ search, category, sort, price, page })

  const isPrevPage = page > 1
  const isNextPage = page < (data?.totalPage || 1);

  // useEffect(() => {
  //   console.log("data:", data)
  //   console.log("category", categoryData)
  // }, [data])

  if(isError) <div>loading....</div>
  return isLoading ? <div>loading...</div> : (
    (
      <div className='min-h-screen flex  pt-20 px-4 text-white'>
        <aside className='w-[250px] flex-shrink-0 flex flex-col items-center rounded-xl bg-[rgb(135,106,137)] shadow-2xl h-[700px] border-[1px] border-gray-400 hover:border-blue-400'>
          <h1 className='mt-2 mb-10 text-3xl text-blue-400'>FILTERS</h1>
          <span className='text-white text-[14px] mb-2'>CATEGORY</span>
          <select
            name="category"
            className='text-white w-[200px] h-[30px] border-[1px]   border-white'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option className='border-gray-400'  value="">all</option>
            {categoryData?.products.map(i => (
              <option className='text-white ' value={i} key={i}>{i}</option>
            ))}
          </select>
  
          <div className='w-full mt-5 p-2 flex flex-col justify-center items-center'>
            <h3 className='text-white mb-2'>max-price {price}</h3>
            <input
              type="range"
              value={price}
              min={100}
              max={100000}
              className="w-full h-2 text-white bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-blue-500"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div className='flex justify-between my-2'>
              <span>{ }</span>
            </div>
          </div>
          <h2 className='text-white'>SORT </h2>
          <select className='text-white w-[200px] h-[30px]'  value={sort} onChange={(e) => setSort((e.target.value))}>
            <option className='text-white'  value="">None</option>
            <option className='text-white' value="asc">price (low to high)</option>
            <option className='text-white'  value="dsc">price (high to low)</option>
          </select>
        </aside>
  
        <div className='flex-1 flex  items-center flex-col px-2'>
          <div className='w-full ml-5 mb-3'><input type="text" value={search} onChange={(e) => setSearch(String(e.target.value))} placeholder='search by name..' className='text-white' /></div>
          <main className='grid grid-cols-4 gap-3 w-full'>
            {!isLoading ? data?.products.map(i => (
              < ProductCard onClick={()=>handleNavigate(i._id)} name={i.name} category={i.category} price={i.price} ratings={i.ratings || 0} photo={i.photo} />
            )) : <div>loading...</div>}
          </main>
          <article className='bg-gray-100 p-5  rounded-2xl fixed   bottom-0 mb-15  mr flex flex-row gap-5 justify-center items-center'>
            <button className='text-black hover:text-blue-400 hover:underline' disabled={!isPrevPage} onClick={() => setPage(prev => prev - 1)}>prev</button>
            <span className='text-black'>{page} of {data?.totalPage || 1}</span>
            <button className='text-black hover:text-blue-400 hover:underline' disabled={!isNextPage} onClick={() => setPage(prev => prev + 1)}>next</button>
          </article>
        </div>
      </div>
  
    )
  )
}

export default Shop