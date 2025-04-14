import { Button } from "@heroui/react";
import React, { useEffect, useState } from "react";

interface VenueImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  heroImage: string;
}

export const VenueImageUpload = ({
  onImageUpload,
  heroImage,
}: VenueImageUploadProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // If a hero image is already provided, set it as the preview
    if (heroImage) {
      setImagePreview(heroImage);
    }
  }, [heroImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    console.log("Uploading image:", image);
    if (!image) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/uploadHeroImage", {
        method: "POST",
        body: formData,
      });

      // Wait for the server response and check for success
      if (response.ok) {
        const result = await response.json();
        if (result.fileUrl) {
          onImageUpload(result.fileUrl); // Send the image URL back to the parent
        } else {
          setError("Image URL not received.");
        }
      } else {
        setError("Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {imagePreview && (
        <div>
          <img
            src={imagePreview}
            alt="Image preview"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </div>
      )}
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <Button onPress={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Hero Image"}
      </Button>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};
