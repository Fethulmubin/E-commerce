import { formatCurrency } from '@/lib/formatters'
import { Column, Img, Row, Section, Text } from '@react-email/components'
import React from 'react'

type OrderInfoProps = {
    order: {id: string, createdAt: Date, pricePaidInCents: number},
    product: {imagePath: string, name: string, description : string},
    downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat('en', {dateStyle: 'medium'})

const OrderInfo = ({order, product, downloadVerificationId}: OrderInfoProps) => {
  return (
    <>
    <Section>
        <Row>
            <Column>
                <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Order Id</Text>
                <Text>{order.id}</Text>
            </Column>
             <Column>
                <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Purchased On</Text>
                <Text>{dateFormatter.format(order.createdAt)}</Text>
            </Column>
             <Column>
                <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Price Paid</Text>
                <Text>{formatCurrency(order.pricePaidInCents / 100)}</Text>
            </Column>
        </Row>
    </Section>
    <Section className='border border-solid border-gray-500 rounded-lg p-4 mt-4'>
        <Img
        width='100%' 
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${product.imagePath}`}/>
    </Section>
    </>
  )
}
 
export default OrderInfo