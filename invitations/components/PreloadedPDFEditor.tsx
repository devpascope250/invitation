// // components/PreloadedPDFEditor.tsx
// import { usePDF } from '@/lib/hooks/usePDF';
// import { useState } from 'react';

// const PreloadedPDFEditor: React.FC = () => {
//   const [name, setName] = useState('');
//   const { modifyAndDownloadPDF, loading, error } = usePDF();

//   // Load PDF from public folder or URL
//   const loadTemplatePDF = async (): Promise<ArrayBuffer> => {
//     try {
//       // Method 1: From public folder
//       const response = await fetch('/Graduation_Invitation_final.pdf');
      
//       // Method 2: From external URL
//       // const response = await fetch('https://example.com/templates/form.pdf');
      
//       if (!response.ok) {
//         throw new Error('Failed to load template PDF');
//       }
      
//       return await response.arrayBuffer();
//     } catch (error) {
//       throw new Error(`Could not load template: ${error}`);
//     }
//   };

//   const handleEditTemplate = async () => {
//     if (!name) {
//       alert('Please enter a name');
//       return;
//     }

//     try {
//       const templateBuffer = await loadTemplatePDF();
      
//       await modifyAndDownloadPDF(templateBuffer, {
//         textFields: [
//           {
//             text: name,
//             x: 190, // Adjust coordinates based on your template
//             y: 440,
//             size: 20,
//             color: { r: 0, g: 0, b: 0 },
//             pageIndex: 0,
//           }
//         ],
//         qrCodes: [
//           {
//             data: `https://verify.com/certificate/${btoa(name)}`,
//             x: 210,
//             y: 50,
//             width: 115,
//             height: 115,
//             pageIndex: 0,
//           },
//         ],
//       }, `invitation-${name}.pdf`);
//     } catch (err) {
//       console.error('Failed to generate PDF:', err);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Certificate Generator</h2>
      
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">
//           Recipient Name:
//         </label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Enter recipient name"
//           className="w-full p-2 border rounded"
//         />
//       </div>

//       <button
//         onClick={handleEditTemplate}
//         disabled={loading || !name}
//         className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
//       >
//         {loading ? 'Generating Certificate...' : 'Generate Certificate'}
//       </button>

//       {error && (
//         <div className="text-red-500 mt-2 text-sm">
//           Error: {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PreloadedPDFEditor;




// components/PreloadedPDFEditor.tsx
import { usePDF } from '@/lib/hooks/usePDF';
import { useState } from 'react';

const PreloadedPDFEditor: React.FC = () => {
  const [name, setName] = useState('');
  const { modifyAndDownloadPDF, loading, error } = usePDF();

  // Load PDF from public folder or URL
  const loadTemplatePDF = async (): Promise<ArrayBuffer> => {
    try {
      const response = await fetch('/Graduation_Invitation_final.pdf');
      
      if (!response.ok) {
        throw new Error('Failed to load template PDF');
      }
      
      return await response.arrayBuffer();
    } catch (error) {
      throw new Error(`Could not load template: ${error}`);
    }
  };

  const handleEditTemplate = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    try {
      const templateBuffer = await loadTemplatePDF();
      
      await modifyAndDownloadPDF(templateBuffer, {
        textFields: [
          {
            text: "(STUDENT)",
            x: 190, // Starting X position
            y: 490,
            size: 19,
            color: { r: 0, g: 0, b: 0 },
            pageIndex: 0,
            maxWidth: 200, // Maximum width for the text area
            align: 'center' as const, // Center align the text
          }, 
          {
            text: name,
            x: 190, // Starting X position
            y: 440,
            size: 18,
            color: { r: 0, g: 0, b: 0 },
            pageIndex: 0,
            maxWidth: 200, // Maximum width for the text area
            align: 'center' as const, // Center align the text
          },
          {
            text: '21RP05430',
            x: 190, // Starting X position
            y: 400,
            size: 18,
            color: { r: 0, g: 0, b: 0 },
            pageIndex: 0,
            maxWidth: 200, // Maximum width for the text area
            align: 'center' as const, // Center align the text
          }
        ],
        qrCodes: [
          {
            data: `21RP05430:12002039993000`,
            x: 230,
            y: 50,
            width: 115,
            height: 115,
            pageIndex: 0,
            transparent: true, // Enable transparent background
          },
        ],
      }, `invitation-${name}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Graduation Invitation Generator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Recipient Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter recipient name"
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Names will be automatically centered and scaled to fit
        </p>
      </div>

      <button
        onClick={handleEditTemplate}
        disabled={loading || !name}
        className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-400 hover:bg-green-600 transition-colors"
      >
        {loading ? 'Generating Invitation...' : 'Generate Invitation'}
      </button>

      {error && (
        <div className="text-red-500 mt-2 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default PreloadedPDFEditor;