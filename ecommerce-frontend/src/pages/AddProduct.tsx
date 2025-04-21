import { useState } from 'react';
import VariantGenerator from '../components/VariantGenerator';

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
    <div className="max-w-5xl mx-auto p-10 bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl shadow-2xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
        ✨ Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Title & SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div className="relative">
            <input
              type="text"
              placeholder=" "
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="peer w-full border rounded-xxl border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-md text-base"
            />
            <label  className="absolute left-3 top-5 text-gray-500 text-base bg-white px-1 transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
              peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm">
              Product Title
            </label>
          </div>

          {/* SKU */}
          <div className="relative">
          <input
            type="text"
            placeholder=" "
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="peer w-full border rounded-xxl border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-md text-base"
          />
          <label
            className="absolute left-3 top-5 text-gray-500 text-base bg-white px-1 transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
              peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm"
          >
            SKU
          </label>
</div>
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            placeholder=" "
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="peer w-full rounded-xxl border border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-md text-base resize-none h-32"
          />
           <label
            className="absolute left-3 top-5 text-gray-500 text-base bg-white px-1 transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
              peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm"
          >
            Product Description
          </label>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Price */}
          <div className="relative">
            <input
              type="number"
              placeholder=" "
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
              className="peer w-full border border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-md text-base"
            />
             <label
            className="absolute left-3 top-5 text-gray-500 text-base bg-white px-1 transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
              peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm"
          >
              Price (₹)
            </label>
          </div>

          {/* Stock */}
          <div className="relative">
            <input
              type="number"
              placeholder=" "
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: +e.target.value })}
              className="peer w-full border border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-md text-base"
            />
             <label
            className="absolute left-3 top-5 text-gray-500 text-base bg-white px-1 transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
              peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm"
          >
              Stock
            </label>
          </div>
        </div>

        {/* Image URL and Preview */}
        {formData.variants.length === 0 && (
          <div className="relative">
            <input
              type="text"
              placeholder=" "
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="peer w-full border border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-md text-base"
            />
             <label
            className="absolute left-3 top-5 text-gray-500 text-base bg-white px-1 transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
              peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm"
          >
              Image URL
            </label>

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
        <div className="pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎨 Product Variants</h2>
          <VariantGenerator onVariantsGenerated={handleVariantsGenerated} />
        </div>

        {/* Submit Button */}
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
