import {Html, Preview, Tailwind, Head, Body, Container, Heading} from '@react-email/components'
import OrderInfo from './components/OrderInfo'

type PurchaseReceiptProps = {
    product: {
        name: string;
        imagePath : string
        description: string; // Optional, in case you want to include it later
    },
      order: {id: string, createdAt: Date, pricePaidInCents: number},
    downloadVerificationId: string;
}

PurchaseReceipt.PreviewProps = {
    product: {name : 'Sample Product', imagePath: 'path/to/image.jpg', description: 'This is a sample product'},
    order: {id: '12345', createdAt: new Date(), pricePaidInCents: 1999},
    downloadVerificationId: 'abc123'
}satisfies PurchaseReceiptProps

export default function PurchaseReceipt({product, order, downloadVerificationId}: PurchaseReceiptProps){
    return (
        <Html>
        <Preview>
            Download {product.name} and view the reciept
        </Preview>
        <Tailwind>
           <Head/>
            <Body className='font-sans bg-white'>
                <Container className='max-w-xl'>
                    <Heading>Purchase Receipt</Heading>
                    <OrderInfo order={order} product={product} downloadVerificationId={downloadVerificationId}/>
                </Container>
            </Body>
        </Tailwind>
        </Html>
    )
}