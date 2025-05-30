import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import QRCode from 'qrcode';
import Select from 'react-select';
import axios from 'axios';
// import {QRCodeSVG} from 'qrcode.react';

type OptionType = {
  value: string;
  label: string;
};

export const Loadit = () => {

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  // const [qrDataUrl, setQrDataUrl] = useState('');

  const options: OptionType[] = [
    { value: 'yashpandey', label: 'Yash Bhushan Pandey' },
    { value: 'altamashbeg', label: 'Altamash Beg' },
    // { value: 'Priyansh Neel', label: 'Priyansh Neel' },
  ];

  // const generateQRCode = async (text: string) => {
  //   try {
  //     const qr = await QRCode.toDataURL(text);  // ✅ base64 URL
  //     setQrDataUrl(qr);
  //   } catch (err) {
  //     console.error('Failed to generate QR:', err);
  //   }
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!file) {
      toast.error('No file selected');
      return;
    }
  
    if (!selectedOption) {
      toast.error('Please select a sender');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('receiver', selectedOption.value); 
      formData.append('label', selectedOption.label);
  
      const response = await axios.post('https://qrsend-backend.onrender.com/upload-files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // const uploadedFileName = response.data.fileName;
      // const backendBaseUrl = "https://qrsend-backend.onrender.com";
      const fileUrl = response.data.viewerFileUrl;

      if (!fileUrl) {
        toast.error('File upload failed: Missing fileUrl');
        return;
      }
      toast.success('Uploaded Successfully✅', {
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Submission failed, please try again');
    }
  };
  // bg-gradient-to-r from-[#3c50e0] to-[#00df9a]
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#3c50e0] px-6">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xl space-y-6">
        <h1 className="text-4xl font-bold font-Manrope text-white text-center">
          Upload Important Files and Select the Sender
        </h1>

        {/* File Select Button */}
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="file-upload" className="cursor-pointer px-6 py-2 bg-black rounded-xl text-white font-semibold hover:bg-white hover:text-black transition">
            Select File
          </label>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          {fileName ? <p className="text-white">📄 {fileName}</p> : <p className="text-white font-bold">No file selected</p>}
        </div>

        {/* Sender Dropdown */}
        <div className="w-full">
          <Select
            placeholder="Select Sender"
            value={selectedOption}
            onChange={(option) => setSelectedOption(option as OptionType)}
            options={options}
            className="text-black"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '10px',
                padding: '2px',
                fontSize: '16px',
              }),
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white font-bold rounded-full hover:bg-white hover:text-black transition"
        >
          Upload Now
        </button>
        {/* {qrDataUrl && <img src={qrDataUrl} alt="Generated QR" style={{ width: '250px' }} />} */}
      </form>
    </div>
  );
};

export default Loadit;