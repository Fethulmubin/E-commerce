import {
  Html,
  Preview,
  Tailwind,
  Head,
  Body,
  Container,
  Heading,
  Hr,
} from "@react-email/components";
import OrderInfo from "./components/OrderInfo";
import React from "react";

type OrderHistoryProps = {
  orders: {
    id: string;
    pricePaidInCents: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: {
      name: string;
      imagePath: string;
      description: string; // Optional, in case you want to include it later
    };
  }[];
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInfo
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr/>}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
