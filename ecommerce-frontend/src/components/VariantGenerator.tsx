import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Alert,
  Box
} from "@mui/material";

interface Variant {
  name: string;
  options: string[];
}

interface CombinationData {
  options: Record<string, string>;
  imageUrl: string;
  price: number;
  stock: number;
}

interface VariantGeneratorProps {
  onVariantsGenerated: (variants: CombinationData[]) => void;
}

const VariantGenerator: React.FC<VariantGeneratorProps> = ({ onVariantsGenerated }) => {
  const [variants, setVariants] = useState<Variant[]>([{ name: "", options: [""] }]);
  const [combinations, setCombinations] = useState<CombinationData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleVariantNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newVariants = [...variants];
    newVariants[index].name = e.target.value;
    setVariants(newVariants);
  };

  const handleOptionChange = (variantIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options[optionIndex] = e.target.value;
    setVariants(newVariants);
  };

  const addOption = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push("");
    setVariants(newVariants);
  };

  const removeOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", options: [""] }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const cartesianProduct = (arrays: string[][]): string[][] => {
    return arrays.reduce<string[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
      [[]]
    );
  };

  const handleGenerate = () => {
    const validVariants = variants.filter(v => v.name.trim() && v.options.some(o => o.trim() !== ""));
    if (validVariants.length === 0) {
      setError("Please fill all variant names and at least one option.");
      return;
    }

    setError(null);

    const variantNames = validVariants.map(v => v.name.trim());
    const optionsMatrix = validVariants.map(v => v.options.map(o => o.trim()).filter(Boolean));
    const allCombinations = cartesianProduct(optionsMatrix);

    const combinationData: CombinationData[] = allCombinations.map(combination => {
      const optionMap: Record<string, string> = {};
      combination.forEach((value, index) => {
        optionMap[variantNames[index]] = value;
      });
      return {
        options: optionMap,
        imageUrl: "",
        price: 0,
        stock: 0,
      };
    });

    setCombinations(combinationData);
  };

  const handleCombinationChange = (
    index: number,
    field: keyof Omit<CombinationData, "options">,
    value: string
  ) => {
    const updated = [...combinations];
    if (field === "price" || field === "stock") {
      const num = Number(value);
      if (!isNaN(num) && num >= 0) {
        updated[index][field] = num;
      }
    } else {
      updated[index][field] = value;
    }
    setCombinations(updated);
  };

  const handleSubmit = () => {
    if (combinations.some(c => !c.price || !c.stock)) {
      setError("Please fill all price and stock fields before submitting.");
      return;
    }
    setError(null);
    onVariantsGenerated(combinations);
  };

  useEffect(() => {
    if (combinations.length > 0) {
      setCombinations([]);
    }
  }, [variants]);

  return (
    <div className="rounded-2xl shadow-xl bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ Variant Generator</h2>
  
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md border border-red-300">
          {error}
        </div>
      )}
  
      {variants.map((variant: any, variantIndex: number) => (
        <div key={variantIndex} className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder=" "
              value={variant.name}
              onChange={(e) => handleVariantNameChange(variantIndex, e)}
              className="peer w-full border border-gray-300 text-gray-800 placeholder-transparent px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-3 top-3 text-gray-500 bg-white px-1 transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
              peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm">
              Variant Name (e.g., Size, Color)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {variant.options.map((option: string, optionIndex: number) => (
              <div key={optionIndex} className="relative">
                <input
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeOption(variantIndex, optionIndex)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 font-bold text-base w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
  
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => addOption(variantIndex)}
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100 transition"
            >
              ➕ Add Option
            </button>
            <button
              type="button"
              onClick={() => removeVariant(variantIndex)}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-100 transition"
            >
              🗑️ Remove Variant
            </button>
          </div>
        </div>
      ))}
  
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={addVariant}
          className="border border-gray-500 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          ➕ Add Variant
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          🚀 Generate Combinations
        </button>
      </div>
  
      {combinations.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Define Data for Each Combination
          </h3>
  
          {combinations.map((combo: any, index: number) => (
            <div key={index} className="mb-4 bg-gray-100 border border-gray-200 rounded-xl p-4">
              <div className="text-gray-800 font-medium mb-3">
                {Object.entries(combo.options)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" / ")}
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["imageUrl", "price", "stock"].map((field) => (
                  <div className="relative" key={field}>
                    <input
                      type={field === "imageUrl" ? "text" : "number"}
                      placeholder=" "
                      value={combo[field]}
                      onChange={(e) =>
                        handleCombinationChange(index, field, e.target.value)
                      }
                      className="peer w-full border border-gray-300 text-gray-800 placeholder-transparent px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="absolute left-3 top-3 text-gray-500 bg-gray-100 px-1 transition-all duration-200 
                      peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                      peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 
                      peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-sm"
                    >
                      {field === "imageUrl"
                        ? "Image URL"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
  
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            ✅ Submit Variants
          </button>
        </>
      )}
    </div>
  );
  
}
  
export default VariantGenerator;
