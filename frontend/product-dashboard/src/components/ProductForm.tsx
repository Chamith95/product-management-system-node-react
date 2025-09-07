import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { CreateProductInput, Product } from '@/types'
import { ProductCategoryEnum } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCategory } from '@/common/utils'
import { ProductsApi } from '@/common/api'

export function ProductForm({
	initial,
	productId,
	onSubmit,
	onCancel,
}: {
	initial?: Partial<Product>
	productId?: string
	onSubmit: (values: CreateProductInput) => void
	onCancel: () => void
}) {
	const [values, setValues] = useState<CreateProductInput>({
		name: '',
		description: '',
		price: 0,
		quantity: 0,
		category: ProductCategoryEnum.OTHER,
	})

	const { data: productData, isLoading, isError } = useQuery({
		queryKey: ['product', productId],
		queryFn: () => ProductsApi.getById(productId!),
		enabled: !!productId,
	})

    console.log(productData)

	useEffect(() => {
		const productToUse = productData?.data || initial
		if (productToUse) {
			setValues((v) => ({
				...v,
				name: productToUse.name || v.name,
				description: productToUse.description || v.description,
				price: Number(productToUse.price) || v.price,
				quantity: Number(productToUse.quantity) || v.quantity,
				category: productToUse.category || v.category,
			}))
		}
	}, [productData, initial])

	if (productId && isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">Loading product...</div>
			</div>
		)
	}

	if (productId && isError) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-destructive">Failed to load product. Please try again.</div>
				<Button variant="outline" onClick={onCancel} className="ml-4">
					Cancel
				</Button>
			</div>
		)
	}

	return (
		<form
			className="grid gap-4"
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit(values)
			}}
		>
			<div className="grid gap-1">
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					required
					value={values.name}
					onChange={(e) => setValues({ ...values, name: e.target.value })}
				/>
			</div>
			<div className="grid gap-1">
				<Label htmlFor="description">Description</Label>
				<textarea
					id="description"
					value={values.description}
					onChange={(e) => setValues({ ...values, description: e.target.value })}
					className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					rows={3}
				/>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div className="grid gap-1">
					<Label htmlFor="price">Price</Label>
					<Input
						id="price"
						type="number"
						step="0.01"
						required
						value={values.price}
						onChange={(e) => setValues({ ...values, price: Number(e.target.value) })}
					/>
				</div>
				<div className="grid gap-1">
					<Label htmlFor="quantity">Quantity</Label>
					<Input
						id="quantity"
						type="number"
						required
						value={values.quantity}
						onChange={(e) => setValues({ ...values, quantity: Number(e.target.value) })}
					/>
				</div>
			</div>
			<div className="grid gap-1">
				<Label htmlFor="category">Category</Label>
				<Select
					value={values.category}
					onValueChange={(v) => setValues({ ...values, category: v as ProductCategoryEnum })}
				>
					<SelectTrigger id="category">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.values(ProductCategoryEnum).map((category) => (
							<SelectItem key={category} value={category}>
								{formatCategory(category)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex gap-2 justify-end mt-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit">Save</Button>
			</div>
		</form>
	)
}


