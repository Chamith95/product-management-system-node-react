import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductDialog } from './components/ProductDialog'
import type { Product } from '@/types'
import { ProductsApi } from '@/common/api'
import { formatCategory, getPrice, getQuantity } from '@/common/utils'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'

export function ProductList() {
  const qc = useQueryClient()
  const { data : productResponse, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: ProductsApi.list,
  })
  const products = useMemo(() => productResponse?.data.products ?? [], [productResponse?.data.products ])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`)
    },
  })

  const handleClose = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id)
      setProductToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setProductToDelete(null)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <main className="mx-auto max-w-6xl p-6">
        <Separator className="mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Products</h1>
          <Button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            Add product
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">Failed to load products. Please try again.</div>
          </div>
        )}

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>${getPrice(p.price)}</TableCell>
                  <TableCell>{getQuantity(p.quantity)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatCategory(p.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm"
                        onClick={() => {
                          setEditing(p)
                          setModalOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm"
                        onClick={() => handleDeleteClick(p)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <ProductDialog
          open={modalOpen}
          onOpenChange={(open) => !open && handleClose()}
          editing={editing}
          onClose={handleClose}
        />

        <ConfirmationDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Delete Product"
          description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </main>
    </div>
  )
}
