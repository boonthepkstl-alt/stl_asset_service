export function isWarrantyExpired(warrantyExpiry: string, asOf: Date = new Date()): boolean {
  return new Date(warrantyExpiry) < asOf;
}
