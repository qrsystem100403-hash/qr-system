import {
  Copy,
  Download,
  ExternalLink,
} from "lucide-react";

import QRPreview from "../shared/QRPreview";

type Props = {
  tableId: string;
  qrUrl: string;
  qrPath: string;

  onCopy: () => void;
  onDownload: () => void;
};

export default function TableCardQRCode({
  tableId,
  qrUrl,
  qrPath,
  onCopy,
  onDownload,
}: Props) {
  return (
    <div className="space-y-6 px-6 py-5">

      <div
  className="
flex
justify-center
rounded-3xl
border
border-[var(--color-border)]
bg-[var(--color-surface-soft)]
p-6
"
>
  <QRPreview
    id={`qr-${tableId}`}
    value={qrUrl}
  />
</div>


      <div className="grid grid-cols-3 gap-2">

        <button
          onClick={onCopy}
          className="
            inline-flex
            h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[var(--color-border)]
            transition
            hover:-translate-y-0.5
hover:bg-[var(--color-surface-hover)]
          "
        >
          <Copy className="size-4" />
        </button>

        <button
          onClick={onDownload}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[var(--color-border)]
            transition
            hover:bg-[var(--color-surface-soft)]
          "
        >
          <Download className="size-4" />
        </button>

        <a
          href={qrPath}
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[var(--color-primary)]
shadow-[var(--shadow-sm)]
hover:-translate-y-0.5
hover:shadow-[var(--shadow-md)]
            text-white
            transition
            hover:opacity-90
          "
        >
          <ExternalLink className="size-4" />
        </a>

      </div>

    </div>
  );
}