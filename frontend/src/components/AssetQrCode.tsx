import { useEffect, useState } from 'react';
import { generateAssetQrDataUrl, downloadDataUrl } from '@/lib/qr';
import { Button } from '@/components/ui';
import { QrCode } from 'lucide-react';

// Shared real, scannable QR renderer for RAISE-FR-OPS-001 -- used by both the Assets list row
// action ("Print QR Code") and Asset Detail's "Print QR" quick action, so there's one place
// that generates the actual QR image instead of two copies that could drift.
export function AssetQrCode({ assetCode }: { assetCode: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    setDataUrl(null);
    generateAssetQrDataUrl(assetCode).then(setDataUrl);
  }, [assetCode]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="p-4 border-2 border-surface-200 rounded-lg h-52 w-52 flex items-center justify-center">
        {dataUrl ? (
          <img src={dataUrl} alt={`QR code for asset ${assetCode}`} className="h-44 w-44" />
        ) : (
          <div className="h-44 w-44 skeleton rounded" />
        )}
      </div>
      <p className="text-body text-surface-600 text-center">Scan to view asset details</p>
      <Button leftIcon={<QrCode className="h-4 w-4" />} disabled={!dataUrl} onClick={() => dataUrl && downloadDataUrl(dataUrl, `${assetCode}-qr.png`)}>
        Download QR
      </Button>
    </div>
  );
}
