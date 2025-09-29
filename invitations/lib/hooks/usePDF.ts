// hooks/usePDF.ts
import { useState } from 'react';
import { pdfService, PDFModificationOptions } from '@/lib/pdfService';

export const usePDF = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modifyAndDownloadPDF = async (
    pdfFile: File | ArrayBuffer,
    options: PDFModificationOptions,
    filename: string = 'invitaion.pdf'
  ) => {
    setLoading(true);
    setError(null);

    try {
      let pdfBuffer: ArrayBuffer;
      
      if (pdfFile instanceof File) {
        pdfBuffer = await pdfFile.arrayBuffer();
      } else {
        pdfBuffer = pdfFile;
      }

      const modifiedPDF = await pdfService.modifyPDF(pdfBuffer, options);
      pdfService.downloadPDF(modifiedPDF, filename);
      
      return modifiedPDF;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to modify PDF';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    modifyAndDownloadPDF,
    loading,
    error,
  };
};