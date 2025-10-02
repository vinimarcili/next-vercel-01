'use client'

import { FaPlus } from "react-icons/fa";
import { ProductCard } from "./(components)/ProductCard";
import ProductForm from "./(components)/ProductForm";
import { useEffect, useState } from "react";
import { Product } from "@/lib/data";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/products'); // URL relativa funciona em Client Components
      if (!res.ok) throw new Error('Falha ao carregar produtos.');
      const data = await res.json();
      setProducts(data)
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Erro Inesperado'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProduct = async (productData: Product) => {
    const isUpdating = 'id' in productData;
    const url = isUpdating ? `/api/products/${productData.id}` : '/api/products';
    const method = isUpdating ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          contentType: 'application/json',
        },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error(isUpdating ? 'Falha ao atualizar produto.' : 'Falha ao criar produto.');
      await fetchProducts()
      setEditingProduct(null);
      setIsFormVisible(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro Inesperado'
      setError(message)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir produto.');
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro Inesperado'
      setError(message)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  if (isLoading) return <p className="text-center mt-8">Carregando produtos...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Erro: {error}</p>;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">Nossos Produtos</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => handleEditProduct(product)}
            onDelete={() => handleDeleteProduct(product.id as number)}
          />
        ))}
      </div>

      {isFormVisible && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingProduct(null);
          }}
        />
      )}
    </main>
  );
}