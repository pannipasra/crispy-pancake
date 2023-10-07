// components/FileUpload.tsx
"use client";
import React, { useState, useRef } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import classNames from "classnames";
import axios from "axios";
import { API_URL } from "@/utils/constant";
const FileUpload = () => {
  const [fileList, setFileList] = useState<File[] | null>(null);
  const [shouldHighlight, setShouldHighlight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const preventDefaultHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFileList(Array.from(files));
    }
  };

  const handleClickSelectFile = () => {
    // Trigger a click event on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    const data = new FormData();
    for (let file of fileList!) {
      data.append('csvFiles', file, file.name);
    }
    axios.post(API_URL.UPLOAD_FILE, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        // Handle the response
        setFileList(null);
        console.log(`res: ${(response.data.message)}`);

      })
      .catch((error) => {
        // Handle errors
        console.log(`err: ${error}`);

      });
  }

  return (
    <div
      className={classNames({
        "w-full h-96": true,
        "p-4 grid place-content-center cursor-pointer": true,
        "text-violet-500 rounded-lg": true,
        "border-4 border-dashed ": true,
        "transition-colors": true,
        "border-violet-500 bg-violet-100": shouldHighlight,
        "border-violet-100 bg-violet-50": !shouldHighlight,
      })}
      onDragOver={(e) => {
        preventDefaultHandler(e);
        setShouldHighlight(true);
      }}
      onDragEnter={(e) => {
        preventDefaultHandler(e);
        setShouldHighlight(true);
      }}
      onDragLeave={(e) => {
        preventDefaultHandler(e);
        setShouldHighlight(false);
      }}
      onDrop={(e) => {
        preventDefaultHandler(e);
        const files = Array.from(e.dataTransfer.files);
        setFileList(files);
        setShouldHighlight(false);
      }}
      onClick={handleClickSelectFile}
    >
      <div className="flex flex-col items-center">
        {!fileList ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
              multiple
            />
            <AiOutlineCloudUpload className="w-10 h-10" />
            <span>
              <span>Choose a File</span> or drag it here
            </span>
          </>
        ) : (
          <>
            <p>Files to Upload</p>
            {fileList.map((file, i) => {
              return <span key={i}>{file.name}</span>;
            })}
            <div className="flex gap-2 mt-2">
              <button
                className="bg-violet-500 text-violet-50 px-2 py-1 rounded-md"
                onClick={() => {
                  handleUpload();
                }}
              >
                Upload
              </button>
              <button
                className="border border-violet-500 px-2 py-1 rounded-md"
                onClick={() => {
                  setFileList(null);
                }}
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;



