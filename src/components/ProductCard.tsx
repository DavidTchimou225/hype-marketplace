type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <a href={`/product/${product.id}`} className="block border rounded-lg p-3">
      <div className="aspect-square bg-gray-100" />
      <h3 className="mt-2 font-medium">{product.name}</h3>
      <p className="text-sm">{product.price.toFixed(2)} FCFA</p>
    </a>
  );
}
