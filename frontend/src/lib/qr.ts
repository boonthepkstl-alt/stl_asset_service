import QRCode from 'qrcode';

// RAISE-FR-OPS-001 (QR / Barcode Identification). The QR encodes a deep link to the asset's
// own detail page (not just the bare code) so that scanning with an ordinary phone camera --
// not just this app's own "Scan QR" input -- satisfies the confirmed AC: "the identified asset
// can be connected to its asset record." Falls back to the bare code if `window` isn't
// available (e.g. server-side/test environments).
export function assetQrPayload(assetCode: string): string {
  if (typeof window === 'undefined') return assetCode;
  return `${window.location.origin}/assets/${assetCode}`;
}

export async function generateAssetQrDataUrl(assetCode: string): Promise<string> {
  return QRCode.toDataURL(assetQrPayload(assetCode), {
    width: 240,
    margin: 1,
    color: { dark: '#0f172a', light: '#ffffff' },
  });
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
