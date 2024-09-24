
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { filedetails } from "..";

export interface FileData {
  category_id : number;  
  title : string;
  uploaded_at : number;
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

export interface IUseFileUploadHook {
  showFileUpload?: boolean;
  setShowFileUpload?: Dispatch<SetStateAction<boolean>>;
  getAllFiles?: (page: number) => void;
  from: string;
}

export interface IUseFileUploadHookReturnType {
    getRootProps: () => void;
    getInputProps: () => void;
    selectedFiles: File[];
    uploadProgress: number;
    uploaddata: {};
    handleChange: () => void;
    setSelectedCategoryId: string | undefined;
    categoriesData: [];
    filestatus : filedetails[];
    handleReUpload : () => void;
    open : boolean;
    handleCancel : () => void;
    handleUpload : () => void;
}