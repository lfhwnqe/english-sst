'use client'
import React, { useState, useRef } from "react";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";

export default function ImageToGif() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gifUrl, setGifUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    // Only accept image files
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setSelectedFiles((prev) => [...prev, ...imageFiles]);

    // Create preview URLs
    const newPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setSelectedFiles((prev) => [...prev, ...imageFiles]);

    const newPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleCreateGif = async () => {
    if (selectedFiles.length < 2) {
      alert("Please select at least 2 images");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/create-gif", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create GIF");

      const data = await response.json();
      setGifUrl(data.gifUrl);
    } catch (error) {
      console.error("Error creating GIF:", error);
      alert("Failed to create GIF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Image to GIF Converter</h1>
        <p className="text-gray-600">
          Upload multiple images to create an animated GIF
        </p>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 mx-auto mb-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <ImagePlus className="w-5 h-5" />
          Select Images
        </button>

        <p className="text-gray-500">or drag and drop images here</p>
      </div>

      {/* Preview Area */}
      {previewUrls.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Selected Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create GIF Button */}
      <button
        onClick={handleCreateGif}
        disabled={isLoading || selectedFiles.length < 2}
        className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating GIF...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Create GIF
          </>
        )}
      </button>

      {/* Result Area */}
      {gifUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your GIF</h2>
          <div className="border rounded-lg p-4">
            <img
              src={gifUrl}
              alt="Generated GIF"
              className="max-w-full mx-auto"
            />
            <a
              href={gifUrl}
              download="animated.gif"
              className="block mt-4 text-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download GIF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
