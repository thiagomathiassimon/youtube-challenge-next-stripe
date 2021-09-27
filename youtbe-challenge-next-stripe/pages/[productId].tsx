import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import Stripe from "stripe";

import stripeConfig from "../config/stripe";

interface Props {
  product: Stripe.Product;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const products = await stripe.products.list();

  const paths = products.data.map((product) => ({
    params: {
      productId: product.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const { productId } = params;

  const product = await stripe.products.retrieve(productId as string);

  console.log(product);
  
  return {
    props: {
      product,
    },
  };
};

const Product: React.FC<Props> = ({ product }) => {
  console.log(product);
  return (
    <div>
      <h1>{product.name}</h1>

      {product.images && <img src={product.images[0]} />}

      <h2>
       {/*product.object. / 100} {product.currency.toUpperCase()*/}
      </h2>
    </div>
  );
};

export default Product;
