import { ProductCard } from "./ProductCard";

export interface Product {
  id: number;
  title: string;
  price: number;
}
async function getProducts(): Promise<{ products: Product[] }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
    next: {
      revalidate: 30
    }
  })
  return {
    products: await response.json()
  };
}

export const ProductsList = async () => {
  const { products } = await getProducts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}