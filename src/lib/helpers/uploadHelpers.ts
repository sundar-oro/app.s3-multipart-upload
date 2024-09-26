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
  setPreviewImages: any,
  maxWidth: number = 200,
  maxHeight: number = 200
) => {
  if (file) {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

        previewStorage.splice(1, 0, {
          fileIndex: file.name,
          previewUrl: resizedDataUrl,
        });
        setPreviewImages(previewStorage);
      };
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

export const calculateChunks = (
  fileSize: number
): { chunkSize: number; totalChunks: number } => {
  const MIN_CHUNK_SIZE_BYTES = 5 * 1024 * 1024;
  const MAX_TOTAL_CHUNKS = 10000;
  const MAX_CHUNK_SIZE_BYTES = 50 * 1024 * 1024;

  let chunkSize: number;

  if (fileSize <= MAX_CHUNK_SIZE_BYTES) {
    chunkSize = Math.max(
      Math.ceil(fileSize / MAX_TOTAL_CHUNKS),
      MIN_CHUNK_SIZE_BYTES
    );
  } else {
    chunkSize = MAX_CHUNK_SIZE_BYTES;
  }

  const totalChunks = Math.ceil(fileSize / chunkSize);

  return { chunkSize, totalChunks };
};
