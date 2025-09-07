import { createFileRoute } from '@tanstack/react-router'
import { ProductList } from '@/modules/products'

export const Route = createFileRoute('/')({
  component: ProductList,
})
