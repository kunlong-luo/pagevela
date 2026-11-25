import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '../store/useResumeStore';
import { useShallow } from 'zustand/react/shallow';
import { trackAnalyticsEvent } from '../lib/analytics';
import { getMarketDefaultFileName } from '../lib/export-utils';
import { getPrintPageStyle } from '../lib/print-style';
import { useToast } from '../components/ui/Toast';

interface UseResumeActionsProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  onPdfExportComplete?: () => void;
}

export function useResumeActions({ contentRef, onPdfExportComplete }: UseResumeActionsProps) {
  const { showToast } = useToast();
  const {
    paperSize,
    uiLanguage,
    isExportingPDF,
    setIsIframeModalOpen,
    setIsExportingPDF,
    setPdfExportProgress
  } = useResumeStore(
    useShallow((state) => ({
      paperSize: state.settings.paperSize,
      uiLanguage: state.uiLanguage,
      isExportingPDF: state.isExportingPDF,
      setIsIframeModalOpen: state.setIsIframeModalOpen,
      setIsExportingPDF: state.setIsExportingPDF,
      setPdfExportProgress: state.setPdfExportProgress
    })),
  );
  
  const getExportTitle = () => {
    const { markdown, settings, customFileName } = useResumeStore.getState();
    return getMarketDefaultFileName({
      markdown,
      settings,
      customFileName,
    });
  };

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: () => getExportTitle(),
    pageStyle: getPrintPageStyle(paperSize),
    onAfterPrint: () => {
      setIsExportingPDF(false);
      setPdfExportProgress(null);
      onPdfExportComplete?.();
    },
    onPrintError: () => {
      setIsExportingPDF(false);
      setPdfExportProgress(null);
    }
  });

  // Quick PDF: one-click raster download via html2canvas + jsPDF.
  // This is kept as a visual-fidelity fallback, not the recommended ATS submission path.
  const handleExportDirectPDF = async () => {
    if (isExportingPDF) return;
    setIsExportingPDF(true);
    setPdfExportProgress(uiLanguage === 'en' ? 'Preparing PDF...' : '准备导出 PDF...');

    try {
      const targetElement = contentRef.current 
        || document.getElementById('resume-print-content') 
        || (document.querySelector('.resume-content') as HTMLElement);

      if (!targetElement) {
        throw new Error('未找到简历内容节点');
      }

      const { exportDirectPDF } = await import('../lib/pdf-export');
      const { settings: currentSettings } = useResumeStore.getState();
      const saveRequested = await exportDirectPDF(targetElement, {
        filename: `${getExportTitle()}.pdf`,
        paperSize: currentSettings.paperSize,
        lang: uiLanguage,
        onProgress: (status) => {
          setPdfExportProgress(status);
        }
      });
      // A false result is not a successful export. The event represents a
      // generated PDF/save request, not proof the OS finished downloading it.
      if (saveRequested !== true) {
        throw new Error('Quick PDF generator did not initiate a save');
      }
      trackAnalyticsEvent('pdf_export_success');
      setIsExportingPDF(false);
      setPdfExportProgress(null);
      onPdfExportComplete?.();
    } catch (err) {
      console.error('Quick PDF export error:', err);
      const exceededRasterBudget = err instanceof Error &&
        err.message.includes('Quick PDF raster exceeds memory budget');
      setIsExportingPDF(false);
      setPdfExportProgress(null);

      showToast?.({
        title: uiLanguage === 'en' ? 'Quick PDF could not be generated' : '快速 PDF 生成失败',
        message: exceededRasterBudget
          ? (uiLanguage === 'en'
            ? 'This document exceeds the safe Quick PDF image-memory budget. Opening the text-preserving browser print option instead.'
            : '简历过长，超出快速 PDF 图像内存安全预算。将改用保留文字的浏览器打印方式。')
          : (uiLanguage === 'en'
            ? 'No PDF download was confirmed. Opening the text-preserving browser print option instead.'
            : '未确认生成可下载的 PDF。将尝试打开保留文字的浏览器打印方式。'),
        type: 'warning',
        duration: 6500,
      });

      // Fall back to the browser print engine so the user still has
      // a text-preserving export path when raster capture fails.
      handleExportVectorPrint();
    }
  };

  // ATS PDF: native browser print / Save as PDF.
  // This is the recommended submission path because browser-generated PDFs
  // normally preserve text/searchability instead of flattening each page to JPEG.
  const handleExportVectorPrint = () => {
    if (isExportingPDF) return;
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      setIsIframeModalOpen(true);
    } else {
      setIsExportingPDF(true);
      setPdfExportProgress(uiLanguage === 'en' ? 'Opening print dialog...' : '调起打印窗口...');
      const timer = setTimeout(() => {
        setIsExportingPDF(false);
        setPdfExportProgress(null);
      }, 6000);

      try {
        trackAnalyticsEvent('browser_print_started');
        handlePrint();
      } catch (err) {
        setIsExportingPDF(false);
        setPdfExportProgress(null);
        clearTimeout(timer);
      }
    }
  };

  // Main action: default to ATS-friendly browser print / Save as PDF.
  const handleExportPDF = () => {
    handleExportVectorPrint();
  };



  return {
    handleExportPDF,
    handleExportDirectPDF,
    handleExportVectorPrint,
    getExportTitle
  };
}
