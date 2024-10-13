import { useState } from 'react';

import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { IProductVariant } from '@shared';
import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/api/products.hooks';

interface ChooseProductVariantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVariant: (variant: IProductVariant) => void;
  selectedVariantId?: string;
}

export function ChooseProductVariantDialog({
  isOpen,
  onClose,
  onSelectVariant,
  selectedVariantId,
}: ChooseProductVariantDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const { results: products, isLoading } = useProducts(
    { name: searchTerm ? searchTerm : undefined },
    { enabled: isOpen, placeholderData: keepPreviousData }
  );

  const handleProductClick = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <DialogTitle>Select Product Variant</DialogTitle>
      <DialogBody>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          autoFocus
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Product Name</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader className="text-center">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )}

              {products?.map((product) => (
                <>
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell className="text-center">
                      <Button onClick={() => handleProductClick(product.id)}>
                        {expandedProductId === product.id ? 'Hide Variants' : 'Show Variants'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedProductId === product.id && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableHeader>Variant Name</TableHeader>
                              <TableHeader>SKU</TableHeader>
                              <TableHeader>Price</TableHeader>
                              <TableHeader className="text-center">Action</TableHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {product.variants.map((variant) => (
                              <TableRow key={variant.id}>
                                <TableCell>{variant.name}</TableCell>
                                <TableCell>{variant.sku}</TableCell>
                                <TableCell>{variant.price}</TableCell>
                                <TableCell className="text-center">
                                  {variant.id === selectedVariantId ? (
                                    <div className="flex justify-center w-full">
                                      <CheckCircleIcon className="size-8 text-green-400" />
                                    </div>
                                  ) : (
                                    <Button
                                      onClick={() => {
                                        onSelectVariant(variant);
                                        onClose();
                                      }}
                                      color="zinc"
                                    >
                                      Select
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogBody>
    </Dialog>
  );
}
