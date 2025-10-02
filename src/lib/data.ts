export interface Product {
    id?: number
    title: string
    price: number
}

export const products: Product[] = [
    {
        id: 1,
        title: 'Smarthphone X',
        price: 399.99
    },
    {
        id: 2,
        title: 'Video Game',
        price: 599.99
    },
    {
        id: 3,
        title: 'Oculos',
        price: 99.99
    },
    {
        id: 4,
        title: 'Ruffles',
        price: 9.99
    }
]