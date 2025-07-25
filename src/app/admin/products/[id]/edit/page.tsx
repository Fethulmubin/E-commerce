import PageHeader from '@/app/admin/_components/PageHeader'
import React from 'react'
import ProductForm from '../../_components/ProductForm'
import db from '@/db/db'

const EditProductPage = async({params}:
    { params: { id: string } }
) => {
    const { id } = params
    const product = await db.product.findUnique({where: {id}})
  return (
   <>
    <PageHeader>Edit Product</PageHeader>
    <ProductForm product ={product}/>
   </>
  )
}

export default EditProductPage