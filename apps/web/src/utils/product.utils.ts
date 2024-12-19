export const generateSKU = (productName: string, existingSKU: string) => {
  const prefix = productName.slice(0, 3).trim().toUpperCase();
  const existingParts = existingSKU.split('-');
  const randomPart = existingParts[1] || Math.floor(1000 + Math.random() * 9000).toString();
  const indexPart = existingParts[2] || '1';

  if (!prefix) {
    return `SKU-${randomPart}-${indexPart}`;
  }

  return `${prefix}-${randomPart}-${indexPart}`;
};
