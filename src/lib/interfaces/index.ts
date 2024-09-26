export interface FileDataDetails {
  title: string;
  uploaded_at: number;
  category_id: number;
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

export interface createcategory {
  name: string;
  description: string;
}

export interface filedetails {
  name: string;
  size: string | number;
  type: string;
  status: string;
}

export interface FileData {
  original_name: string;
  type: string;
  size: number;
  name: string;
  path: string;
}
export interface PresignedUrlsResponse {
  success: boolean;
  data: string[];
}

export interface FileError {
  file: File;
  reason: string;
}
export interface UploadFileResponse {
  success: boolean;
  data: {
    upload_id: string;
    file_key: string;
    original_name: string;
    name: string;
    path: string;
  };
}

export interface PresignedUrlsResponse {
  success: boolean;
  data: string[];
}

export interface ChunkResponse {
  ETag: string;
  PartNumber: number;
}

export type FileProgress = Record<number, number>;

export interface FileError {
  file: File;
  id: number;
  reason: string;
}

export interface FilePreview {
  fileIndex: string;
  previewUrl: string;
}

export interface FileFormData {
  chunkSize: string;
  unit: "MB" | "GB";
  totalChunksParts: string;
  chunkSizeInBytes: number;
}

export interface uploadImagesComponentProps {
  handleFileChange: (files: File[], start: any) => void;
  multipleFiles: File[];
  previewImages: { fileIndex: string; previewUrl: string }[];
  fileProgress: FileProgress;
  fileErrors: any;
  setMultipleFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setFileProgress: React.Dispatch<React.SetStateAction<FileProgress>>;
  setFileFormData: React.Dispatch<React.SetStateAction<FileFormData>>;
  fileFormData: any;
  resumeUpload: (file: File, index: number) => void;
  abortFileUpload: (index: number) => void;
  abortedFiles: Set<number>;
  uploadProgressStart: any;
  fileTitles: any;
  setFileTitles: any;
  selectedCategoryId: any;
  setSelectedCategoryId: any;
  setShowFileUpload: any;
  from: string;
  setFileErrors: any;
}
