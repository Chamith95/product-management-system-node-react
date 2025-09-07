import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { ProductsApi } from '@/common/api'
import { ProductForm } from '@/components/ProductForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Product | null
  onClose: () => void
}

export function ProductDialog({ open, onOpenChange, editing, onClose }: ProductDialogProps) {
  const qc = useQueryClient()

  const createMutation = useMutation({
    mutationFn: ProductsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      onClose()
      toast.success('Product created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Product> }) =>
      ProductsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      onClose()
      toast.success('Product updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`)
    },
  })

  const handleSubmit = (input: any) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, input })
    } else {
      createMutation.mutate(input)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit product' : 'Add product'}</DialogTitle>
        </DialogHeader>
        <ProductForm
          initial={editing ?? undefined}
          productId={editing?.id}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
