import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, QrCode, X } from 'lucide-react';
import { useDialogFocus } from '../../hooks/useDialogFocus';

// Pre-rendered QR matrix for the public homepage only. Version 3 / ECC M,
// encoded locally with an ISO-compliant QR encoder; no network API, account,
// resume text, or private share fragment is involved.
export const PAGEVELA_HOME_URL = 'https://kunlong-luo.github.io/pagevela/';
const QR_ROWS = [
  '1fc1e27f', '105aff41', '174f455d', '1747645d', '175c6e5d',
  '1040ab41', '1fd5557f', '0009d900', '1548c912', '0cbe1dc9',
  '10e98197', '180dfd52', '1cd75bcb', '01a718c9', '0e7c8c8b',
  '1a0619da', '157a1fcb', '0d3291cd', '11ec48f3', '0890eb4a',
  '164159f0', '00175117', '1fca975b', '10422d19', '175b09f3',
  '17441297', '17574a39', '10499f52', '1fdf7fc3',
] as const;

// One vector path for all black modules; keep a four-module white quiet zone
// so WeChat and phone-camera scanners can detect the code on any theme.
const qrPath = QR_ROWS.flatMap((hex, row) => {
  const bits = Number.parseInt(hex, 16);
  return Array.from({ length: 29 }, (_, col) =>
    bits & (1 << (28 - col))
      ? `M${col + 4} ${row + 4}h1v1h-1z`
      : '',
  );
}).filter(Boolean).join(' ');

interface LandingQrModalProps {
  isOpen: boolean;
  isEn: boolean;
  onClose: () => void;
}

export function LandingQrModal({ isOpen, isEn, onClose }: LandingQrModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  useDialogFocus({ isOpen, dialogRef, onClose });

  if (!isOpen || typeof document === 'undefined') return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PAGEVELA_HOME_URL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
        aria-label={isEn ? 'Close QR code' : '关闭二维码'}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-qr-title"
        tabIndex={-1}
        data-testid="landing-qr-dialog"
        className="relative z-10 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3 text-left">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <QrCode className="h-5 w-5" aria-hidden="true" />
            <h2 id="landing-qr-title" className="text-base font-extrabold text-slate-900 dark:text-white">
              {isEn ? 'Open Pagevela on your phone' : '手机扫码打开页帆'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={isEn ? 'Close QR code' : '关闭二维码'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-left text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {isEn
            ? 'Scan with your phone camera or WeChat to open the official website.'
            : '使用手机相机或微信扫一扫，即可打开正式网站。'}
        </p>
        <div className="mx-auto mt-5 w-fit rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700">
          <svg
            viewBox="0 0 37 37"
            width="232"
            height="232"
            className="block h-[min(56vw,232px)] w-[min(56vw,232px)]"
            role="img"
            aria-label={isEn ? 'QR code for the Pagevela homepage' : '页帆官网二维码'}
            data-testid="landing-home-qr"
            shapeRendering="crispEdges"
          >
            <rect width="37" height="37" fill="#fff" />
            <path d={qrPath} fill="#111827" />
          </svg>
        </div>
        <p className="mt-4 break-all text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {PAGEVELA_HOME_URL}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? (isEn ? 'Link copied' : '链接已复制') : (isEn ? 'Copy link' : '复制网址')}
        </button>
      </div>
    </div>,
    document.body,
  );
}
