export interface ProductImage {
    url: string;
    altText: string;
    isPrimary: boolean;
}

export interface StockLog {
    type: 'ADDED' | 'REMOVED' | 'ADJUSTED';
    quantity: number;
    note: string;
}

export interface ProductVariant {
    sku: string;
    price: number;
    stock: number;
    options: Record<string, string>;
    images: ProductImage[];
    stockLog: StockLog;
}

export interface Product {
    title: string;
    description: string;
    sku: string | null;
    price: number;
    stock: number;
    options: Record<string, string> | null;
    images: ProductImage[];
    variants: ProductVariant[];
} 