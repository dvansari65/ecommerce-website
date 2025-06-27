
import { useGetSingleProductsQuery } from '@/redux/api/productApi'
import type { RootState } from "../redux/reducer/store"
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function ProductDetail() {
    const { id } = useParams<{ id: string }>()
    const { data, isLoading, isError, error } = useGetSingleProductsQuery(
        { id: id as string },
        { skip: !id }
      )
      const { user } = useSelector((state: RootState) => state.userReducer)
      
    //   useEffect(() => {
    //     console.log("🔍 ID:", id)
    //     console.log("📦 Data:", data)
    //     console.log("⚠️ Error:", error)
    //     console.log("⏳ Loading:", isLoading)
    //     console.log("❌ isError:", isError)
    //     console.log("user:",user)
    //   }, [id, data, error])
      
    return (
        <div className='flex flex-row justify-center items-start w-full  h-screen bg-gray-200'>
            <div className='flex flex-row justify-center items-start bg-white'  >
                <div className='w-full h-full'>
                {/* <img src={data?.product.photo} alt={data?.product.name} /> */}

                </div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default ProductDetail