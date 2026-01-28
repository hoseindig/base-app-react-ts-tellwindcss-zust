// products.ts
export interface Product {
    readonly id: number;
    name: string;
    price: number;
}

export const products: Product[] = [
    { id: 1, name: "apple", price: 190 },
    { id: 2, name: "samsung", price: 90 },
    { id: 3, name: "nokia", price: 30 },
];

export function listProduct(): string[] {
    return products.map(
        (item) => `${item.name} ${item.price}`
    );
}
