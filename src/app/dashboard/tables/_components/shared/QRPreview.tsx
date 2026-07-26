"use client";

import { QRCodeCanvas } from "qrcode.react";

type Props = {
  id: string;
  value: string;
};

export default function QRPreview({
  id,
  value,
}: Props) {
  return (
    <div
      className="
        flex
        justify-center
      "
    >
      <div
        className="
          rounded-2xl
          bg-white
          p-3
        "
      >
        <QRCodeCanvas
          id={id}
          value={value}
          size={140}
        />
      </div>
    </div>
  );
}