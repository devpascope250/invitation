// /* eslint-disable @typescript-eslint/no-explicit-any */
// // lib/pdfService.ts
import { PDFDocument, rgb, PDFPage, StandardFonts } from 'pdf-lib';
// import fontkit from '@pdf-lib/fontkit';
// import QRCode from 'qrcode';

// export interface PDFModificationOptions {
//   textFields?: Array<{
//     text: string;
//     x: number;
//     y: number;
//     size?: number;
//     color?: { r: number; g: number; b: number };
//     pageIndex?: number;
//   }>;
//   images?: Array<{
//     imageUrl: string;
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     pageIndex?: number;
//   }>;
//   qrCodes?: Array<{
//     data: string;
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     pageIndex?: number;
//   }>;
// }

// class PDFService {
//   private async loadFonts(pdfDoc: PDFDocument) {
//     try {
//       pdfDoc.registerFontkit(fontkit);
//       // Load custom font if needed, or use built-in
//       // const fontBytes = await fetch('/fonts/arial.ttf').then(res => res.arrayBuffer());
//       // return await pdfDoc.embedFont(fontBytes);
//     } catch {
//       console.warn('Font loading failed, using standard fonts');
//     }
//     // Use StandardFonts enum for pdf-lib
//     return pdfDoc.embedStandardFont(StandardFonts.Helvetica);
//   }

//   private async addTextToPage(
//     page: PDFPage,
//     text: string,
//     x: number,
//     y: number,
//     font: any,
//     size: number = 12,
//     color: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 }
//   ) {
//     page.drawText(text, {
//       x,
//       y,
//       size,
//       font,
//       color: rgb(color.r, color.g, color.b),
//     });
//   }

//   private async addImageToPage(
//     page: PDFPage,
//     imageUrl: string,
//     x: number,
//     y: number,
//     width: number,
//     height: number
//   ) {
//     let image;
//     if (imageUrl.startsWith('data:image/png')) {
//       const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
//       image = await page.doc.embedPng(imageBytes);
//     } else if (imageUrl.startsWith('data:image/jpeg') || imageUrl.startsWith('data:image/jpg')) {
//       const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
//       image = await page.doc.embedJpg(imageBytes);
//     } else {
//       throw new Error('Unsupported image format');
//     }

//     page.drawImage(image, {
//       x,
//       y,
//       width,
//       height,
//     });
//   }

//   private async addQRCodeToPage(
//     page: PDFPage,
//     data: string,
//     x: number,
//     y: number,
//     width: number,
//     height: number
//   ) {
//     const qrCodeDataUrl = await QRCode.toDataURL(data, {
//       width: 300,
//       margin: 1,
//     });
//     await this.addImageToPage(page, qrCodeDataUrl, x, y, width, height);
//   }

//   async modifyPDF(
//     pdfBuffer: ArrayBuffer | Uint8Array | Buffer,
//     options: PDFModificationOptions
//   ): Promise<Uint8Array> {
//     const pdfDoc = await PDFDocument.load(pdfBuffer);
//     const font = await this.loadFonts(pdfDoc);

//     // Process text fields
//     if (options.textFields) {
//       for (const field of options.textFields) {
//         const pageIndex = field.pageIndex || 0;
//         const page = pdfDoc.getPages()[pageIndex];
        
//         await this.addTextToPage(
//           page,
//           field.text,
//           field.x,
//           field.y,
//           font,
//           field.size,
//           field.color
//         );
//       }
//     }

//     // Process images
//     if (options.images) {
//       for (const image of options.images) {
//         const pageIndex = image.pageIndex || 0;
//         const page = pdfDoc.getPages()[pageIndex];
        
//         await this.addImageToPage(
//           page,
//           image.imageUrl,
//           image.x,
//           image.y,
//           image.width,
//           image.height
//         );
//       }
//     }

//     // Process QR codes
//     if (options.qrCodes) {
//       for (const qr of options.qrCodes) {
//         const pageIndex = qr.pageIndex || 0;
//         const page = pdfDoc.getPages()[pageIndex];
        
//         await this.addQRCodeToPage(
//           page,
//           qr.data,
//           qr.x,
//           qr.y,
//           qr.width,
//           qr.height
//         );
//       }
//     }

//     return await pdfDoc.save();
//   }

//   async downloadPDF(pdfBytes: Uint8Array, filename: string = 'document.pdf') {
//   // Convert Uint8Array to ArrayBuffer for Blob compatibility
//   const arrayBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
//   const blob = new Blob([arrayBuffer as ArrayBuffer], { type: 'application/pdf' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }
// }

// export const pdfService = new PDFService();







// lib/pdfService.ts
import {PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';

export interface PDFModificationOptions {
  textFields?: Array<{
    text: string;
    x: number;
    y: number;
    size?: number;
    color?: { r: number; g: number; b: number };
    pageIndex?: number;
    maxWidth?: number; // Add max width for centering
    align?: 'left' | 'center' | 'right'; // Add text alignment
  }>;
  images?: Array<{
    imageUrl: string;
    x: number;
    y: number;
    width: number;
    height: number;
    pageIndex?: number;
  }>;
  qrCodes?: Array<{
    data: string;
    x: number;
    y: number;
    width: number;
    height: number;
    pageIndex?: number;
    margin?: number; // Add margin control for QR codes
    transparent?: boolean; // Add transparency option
  }>;
}

class PDFService {
  private async loadFonts(pdfDoc: PDFDocument) {
    try {
      pdfDoc.registerFontkit(fontkit);
      // Fetch the font file from public/fonts/timesbi.ttf
      const fontUrl = '/fonts/timesbi.TTF';
      const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
      return await pdfDoc.embedFont(fontBytes);
    } catch (error) {
      console.warn('Custom font loading failed, using standard fonts', error);
      return pdfDoc.embedStandardFont(StandardFonts.Helvetica);
    }
  }

  private calculateTextWidth(text: string, font: PDFFont, fontSize: number): number {
    return font.widthOfTextAtSize(text, fontSize);
  }

  private async addTextToPage(
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    font: PDFFont,
    size: number = 12,
    color: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 },
    maxWidth?: number,
    align: 'left' | 'center' | 'right' = 'left'
  ) {
    let finalX = x;
    
    // Calculate text width and apply alignment
    const textWidth = this.calculateTextWidth(text, font, size);
    
    if (maxWidth && align === 'center') {
      finalX = x + (maxWidth - textWidth) / 2;
    } else if (maxWidth && align === 'right') {
      finalX = x + (maxWidth - textWidth);
    }

    // Handle long names by adjusting font size
    let finalSize = size;
    if (maxWidth && textWidth > maxWidth) {
      // Scale down font size proportionally
      const scaleFactor = maxWidth / textWidth;
      finalSize = Math.max(8, size * scaleFactor); // Minimum size of 8
    }

    page.drawText(text, {
      x: finalX,
      y,
      size: finalSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  }

  private async addImageToPage(
    page: PDFPage,
    imageUrl: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    let image;
    if (imageUrl.startsWith('data:image/png')) {
      const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
      image = await page.doc.embedPng(imageBytes);
    } else if (imageUrl.startsWith('data:image/jpeg') || imageUrl.startsWith('data:image/jpg')) {
      const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
      image = await page.doc.embedJpg(imageBytes);
    } else {
      throw new Error('Unsupported image format');
    }

    page.drawImage(image, {
      x,
      y,
      width,
      height,
    });
  }

  private async generateTransparentQRCode(data: string, size: number = 300): Promise<string> {
    // Create QR code with transparent background
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    // Make background transparent
    ctx.clearRect(0, 0, size, size);
    
    // Generate QR code
    await QRCode.toCanvas(canvas, data, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000', // Black dots
        light: '#00000000' // Transparent background
      }
    });

    return canvas.toDataURL('image/png');
  }

  private async addQRCodeToPage(
    page: PDFPage,
    data: string,
    x: number,
    y: number,
    width: number,
    height: number,
    transparent: boolean = true
  ) {
    let qrCodeDataUrl: string;
    
    if (transparent) {
      // Generate QR code with transparent background
      qrCodeDataUrl = await this.generateTransparentQRCode(data, 300);
    } else {
      // Generate normal QR code
      qrCodeDataUrl = await QRCode.toDataURL(data, {
        width: 300,
        margin: 1,
      });
    }

    await this.addImageToPage(page, qrCodeDataUrl, x, y, width, height);
  }

  async modifyPDF(
    pdfBuffer: ArrayBuffer | Uint8Array | Buffer,
    options: PDFModificationOptions
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const font = await this.loadFonts(pdfDoc);

    // Process text fields
    if (options.textFields) {
      for (const field of options.textFields) {
        const pageIndex = field.pageIndex || 0;
        const page = pdfDoc.getPages()[pageIndex];
        
        await this.addTextToPage(
          page,
          field.text,
          field.x,
          field.y,
          font,
          field.size,
          field.color,
          field.maxWidth,
          field.align
        );
      }
    }

    // Process images
    if (options.images) {
      for (const image of options.images) {
        const pageIndex = image.pageIndex || 0;
        const page = pdfDoc.getPages()[pageIndex];
        
        await this.addImageToPage(
          page,
          image.imageUrl,
          image.x,
          image.y,
          image.width,
          image.height
        );
      }
    }

    // Process QR codes
    if (options.qrCodes) {
      for (const qr of options.qrCodes) {
        const pageIndex = qr.pageIndex || 0;
        const page = pdfDoc.getPages()[pageIndex];
        
        await this.addQRCodeToPage(
          page,
          qr.data,
          qr.x,
          qr.y,
          qr.width,
          qr.height,
          qr.transparent
        );
      }
    }

    return await pdfDoc.save();
  }

  async downloadPDF(pdfBytes: Uint8Array, filename: string = 'document.pdf') {
     const arrayBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
    const blob = new Blob([arrayBuffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const pdfService = new PDFService();