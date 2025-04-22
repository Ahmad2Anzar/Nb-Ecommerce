import { Product } from '../types/product.types';
import prisma from '../db';

interface ProductServiceResponse {
    success: boolean;
    data?: any;
    message?: string;
}

const addProductService = async (productData: Product): Promise<ProductServiceResponse> => {
    try {
        // Start a transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Create the main product
            const product = await tx.product.create({
                data: {
                    title: productData.title,
                    description: productData.description,
                    sku: productData.sku,
                    price: productData.price,
                    stock: productData.stock,
                    options: productData.options || undefined,
                }
            });

            // Create product-level images (for simple/default products)
            if (Array.isArray(productData.images) && productData.images.length > 0) {
                await tx.productImage.createMany({
                    data: productData.images.map(image => ({
                        productId: product.id,
                        url: image.url,
                        altText: image.altText,
                        isPrimary: image.isPrimary
                    }))
                });
            }

            // If variants exist, treat as variant product
            if (Array.isArray(productData.variants) && productData.variants.length > 0) {
                for (const variant of productData.variants) {
                    // Create a dynamic title based on variant options
                    const variantTitle = `${productData.title} - ${Object.entries(variant.options)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}`;

                    const variantProduct = await tx.product.create({
                        data: {
                            title: variantTitle,
                            description: productData.description,
                            sku: variant.sku,
                            price: variant.price,
                            stock: variant.stock,
                            options: variant.options,
                            parentId: product.id
                        }
                    });

                    // Create variant images
                    if (Array.isArray(variant.images) && variant.images.length > 0) {
                        await tx.productImage.createMany({
                            data: variant.images.map(image => ({
                                productId: variantProduct.id,
                                url: image.url,
                                altText: image.altText,
                                isPrimary: image.isPrimary
                            }))
                        });
                    }

                    // Create stock log for variant
                    await tx.stockLog.create({
                        data: {
                            productId: variantProduct.id,
                            type: variant.stockLog.type,
                            quantity: variant.stockLog.quantity,
                            note: variant.stockLog.note
                        }
                    });
                }
            } else {
                // Create stock log for simple product (no variants)
                await tx.stockLog.create({
                    data: {
                        productId: product.id,
                        type: 'IN',
                        quantity: productData.stock,
                        note: 'Initial stock for default product'
                    }
                });
            }

            return product;
        });

        return {
            success: true,
            data: result,
            message: "Product created successfully"
        };
    } catch (error) {
        console.error("Error in addProductService:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to create product"
        };
    }
}

export { addProductService };
