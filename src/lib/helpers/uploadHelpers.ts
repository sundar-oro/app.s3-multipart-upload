export const generateVideoThumbnail = async (
  file: any,
  previewStorage: any,
  setPreviewImages: any
) => {
  if (file) {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const videoDataUrl = e.target.result;

      // Create a video element dynamically
      const video = document.createElement("video");
      video.src = videoDataUrl;
      video.preload = "auto";

      // Ensure metadata is loaded before capturing a frame
      video.addEventListener("canplay", () => {
        const canvas: any = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);

        const thumbnailUrl = canvas.toDataURL();

        previewStorage.splice(1, 0, {
          fileIndex: file.name,
          previewUrl: thumbnailUrl,
        });
        setPreviewImages(previewStorage);
        video.remove();
      });
    };

    reader.readAsDataURL(file);
  }
};

export const previewImagesEvent = async (
  file: any,
  previewStorage: any,
  setPreviewImages: any
) => {
  if (file) {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      previewStorage.splice(1, 0, {
        fileIndex: file.name,
        previewUrl: e.target.result,
      });
      setPreviewImages(previewStorage);
    };
    reader.readAsDataURL(file);
  } else {
    setPreviewImages(null);
  }
};

export const bytesToMB = (bytes: any) => {
  return bytes / (1024 * 1024);
};

export const getTotalChunks = (
  chunkSize: number,
  bytes: number,
  unit: "MB" | "GB"
) => {
  if (chunkSize < 5) {
    unit = "GB";
  }
  let chunkSizeInBytes: number;

  if (unit == "MB") {
    chunkSizeInBytes = chunkSize * 1024 * 1024;
  } else if (unit == "GB") {
    chunkSizeInBytes = chunkSize * 1024 * 1024 * 1024;
  } else {
    throw new Error("Invalid unit. Use 'MB' or 'GB'.");
  }
  return Math.ceil(bytes / chunkSizeInBytes);
};
