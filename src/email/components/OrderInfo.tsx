import { formatCurrency } from "@/lib/formatters";
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

type OrderInfoProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  product: { imagePath: string; name: string; description: string };
  downloadVerificationId: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

const OrderInfo = ({
  order,
  product,
  downloadVerificationId,
}: OrderInfoProps) => {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Order Id
            </Text>
            <Text>{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Purchased On
            </Text>
            <Text>{dateFormatter.format(order.createdAt)}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Price Paid
            </Text>
            <Text>{formatCurrency(order.pricePaidInCents / 100)}</Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500 rounded-lg p-4 mt-4">
        <Img
          width="100%"
          alt={product.name}
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${product.imagePath}`}
        />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
          </Column>
          <Column align="right">
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`}
              className="bg-black text-white rounded-lg py-4 px-6"
            >
              Download
            </Button>
          </Column>
        </Row>
        <hr />
        <Row>
          <Column className="mx-auto mt-2">
            <Text className="text-gray-500">{product.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  );
};

export default OrderInfo;
