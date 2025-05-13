import { useState } from 'react';
import VariantGenerator from '../components/VariantGenerator';
import FloatingInput from '../utils/FloatingInput';
import FloatingTextarea from '../utils/FloatingTextArea';

interface ProductImage {
  url: string;
  altText: string;
  isPrimary: boolean;
}

interface ProductFormData {
  title: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string;
  options: Record<string, string>;
  variants: {
    sku: string;
    price: number;
    stock: number;
    options: Record<string, string>;
    images: ProductImage[];
    stockLog: {
      type: string;
      quantity: number;
      note: string;
    };
  }[];
}

const AddProduct = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    sku: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    options: {},
    variants: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalData = { ...formData };

    if (formData.variants.length === 0) {
      const variantImage: ProductImage[] = formData.imageUrl
        ? [
            {
              url: formData.imageUrl,
              altText: formData.title,
              isPrimary: true,
            },
          ]
        : [];

      finalData = {
        ...formData,
        variants: [
          {
            sku: formData.sku,
            price: formData.price,
            stock: formData.stock,
            options: {},
            images: variantImage,
            stockLog: {
              type: 'IN',
              quantity: formData.stock,
              note: 'Initial stock for default product',
            },
          },
        ],
      };
    }

    try {
      const response = await fetch('http://localhost:3000/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      console.log('Product created:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVariantsGenerated = (variants: {
    options: Record<string, string>;
    imageUrl: string;
    price: number;
    stock: number;
  }[]) => {
    setFormData((prev) => ({
      ...prev,
      variants: variants.map((variant) => ({
        sku: `${prev.sku}-${Object.values(variant.options).join('-')}`,
        price: variant.price,
        stock: variant.stock,
        options: variant.options,
        images: variant.imageUrl
          ? [
              {
                url: variant.imageUrl,
                altText: `${prev.title} - ${Object.values(variant.options).join(' ')}`,
                isPrimary: true,
              },
            ]
          : [],
        stockLog: {
          type: 'IN',
          quantity: variant.stock,
          note: 'Initial stock',
        },
      })),
    }));
  };

return (
  <div className="w-screen min-h-screen px-6 py-12 md:px-12 bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl shadow-2xl">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Add New Product</h1>

    <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl mx-auto">
      {/* Title & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Title */}
        <FloatingInput
          label="Product Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* SKU */}
        <FloatingInput
          label="SKU"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />
      </div>

      {/* Description */}
      <FloatingTextarea
        label="Product Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      {/* Price & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FloatingInput
          label="Price (₹)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
        />
        <FloatingInput
          label="Stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: +e.target.value })}
        />
      </div>

      {/* Image URL and Preview */}
      {formData.variants.length === 0 && (
        <div className="relative">
          <FloatingInput
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="mt-4 h-40 w-40 object-cover rounded-lg border shadow-md"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>
      )}

      {/* Variants */}
      <div className="pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎨 Product Variants</h2>
        <VariantGenerator onVariantsGenerated={handleVariantsGenerated} />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
        >
          🚀 Create Product
        </button>
      </div>
    </form>
  </div>
);

};

export default AddProduct;
