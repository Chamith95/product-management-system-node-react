export enum ProductCategoryEnum {
	ELECTRONICS = 'electronics',
	CLOTHING = 'clothing',
	BOOKS = 'books',
	HOME = 'home',
	SPORTS = 'sports',
	OTHER = 'other'
}

export interface Product {
	id: string
	name: string
	description: string
	price: number
	quantity: number
	category: ProductCategoryEnum
	createdAt?: string
	updatedAt?: string
}

export interface Pagination {
	page: number
	limit: number
	total: number
}

export interface ProductResponse {
	products: Array<Product>
	pagination: Pagination
}

export interface CreateProductInput {
	name: string
	description: string
	price: number
	quantity: number
	category: ProductCategoryEnum
}

export interface ApiCommonResponse<T> {
	data: T
}

export type UpdateProductInput = Partial<CreateProductInput>


