import { useState } from 'react';

import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { IProductVariant, IProductWithCategory } from '@repo/shared';
import { keepPreviousData } from '@tanstack/react-query';

import { LetterBox } from '@/components/common/letter-box/letter-box';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/api/products.hooks';
import { cn } from '@/utils/cn';
import { parseFloat } from '@/utils/number-utils';

export interface IProductVariantWithProduct extends IProductVariant {
  product: IProductWithCategory;
}

interface ChooseProductVariantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVariant: (variant: IProductVariantWithProduct) => void;
  selectedVariantId?: string;
  priceField: 'price' | 'costPrice';
  priceLabel: string;
}

export function ChooseProductVariantDialog({
  isOpen,
  onClose,
  onSelectVariant,
  selectedVariantId,
  priceField,
  priceLabel,
}: ChooseProductVariantDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  const { results: products, isLoading } = useProducts(
    { name: searchTerm || undefined },
    { enabled: isOpen, placeholderData: keepPreviousData }
  );

  const toggleProduct = (productId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const formatPrice = (price: number) => {
    return (
      <span className="text-right">
        <small>&#x20A8;</small> {parseFloat(price.toString())}
      </span>
    );
  };

  const handleSelectVariant = (variant: IProductVariantWithProduct) => {
    onSelectVariant(variant);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <DialogTitle>Choose Products</DialogTitle>
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
          <Table striped bleed dense>
            <TableHead>
              <TableRow>
                <TableHeader>Product / Variant</TableHeader>
                <TableHeader>Company</TableHeader> {/* Add this column */}
                <TableHeader>Category</TableHeader>
                <TableHeader className="text-right">{priceLabel}</TableHeader>
                <TableHeader className="text-center">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )}

              {products?.map((product) => (
                <>
                  <TableRow key={product.id} className="bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <LetterBox text={product.name} />
                        <div className="flex flex-col">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-400 dark:text-gray-500">
                            {product.variants.length > 0 ? `${product.variants.length} variants` : <>&mdash;</>}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.productCompany || '—'}</TableCell> {/* Add this cell */}
                    <TableCell>{product.category?.name || '—'}</TableCell>
                    <TableCell className="text-right">
                      {product.variants.length > 0 ? (
                        <>
                          {(() => {
                            const prices = product.variants.map((v) => v.price);
                            const hasPrices = prices.length > 0;
                            const min = hasPrices ? Math.min(...prices) : 0;
                            const max = hasPrices ? Math.max(...prices) : 0;
                            const formattedPrice = min === max ? `${min}` : `${min} - ${max}`;

                            return (
                              <span className="text-right">
                                <small>&#x20A8;</small> {formattedPrice}
                              </span>
                            );
                          })()}
                        </>
                      ) : (
                        <span className="text-gray-500">&mdash;</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.variants.length <= 1 ? (
                        <Button
                          onClick={() =>
                            handleSelectVariant({
                              ...product.variants[0],
                              product,
                            })
                          }
                          color="zinc"
                        >
                          Select
                        </Button>
                      ) : (
                        <button
                          className={cn(
                            expandedProducts[product.id]
                              ? 'text-zinc-500 hover:text-zinc-700 bg-zinc-500/10'
                              : 'text-blue-500 hover:text-blue-700 bg-blue-500/10',
                            'uppercase text-xs font-bold px-2 py-1 rounded-md'
                          )}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            toggleProduct(product.id);
                          }}
                        >
                          {expandedProducts[product.id] ? 'Hide' : 'Show'}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>

                  {expandedProducts[product.id] &&
                    product.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <div className="flex flex-col gap-0 pl-14">
                            <div className="text-sm text-muted-foreground">{variant.name}</div>
                            <div className="text-xs text-muted-foreground">{variant.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.productCompany || '—'}</TableCell> {/* Add this cell */}
                        <TableCell>
                          <div />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(parseFloat(variant[priceField].toString()))}
                        </TableCell>
                        <TableCell className="text-center">
                          {variant.id === selectedVariantId ? (
                            <div className="flex justify-center w-full">
                              <CheckCircleIcon className="size-8 text-green-400" />
                            </div>
                          ) : (
                            <Button onClick={() => handleSelectVariant({ ...variant, product })} color="zinc">
                              Select
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogBody>
    </Dialog>
  );
}