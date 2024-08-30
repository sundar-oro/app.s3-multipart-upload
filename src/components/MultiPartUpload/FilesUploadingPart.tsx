import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneIcon from "@mui/icons-material/Done";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { removeOneElement } from "../../Redux/Modules/FileUpload";
import { bytesToMB } from "../../lib/helpers/uploadHelpers";
import { uploadImagesComponentProps } from "../../lib/interfaces";
import "./UploadFiles.scss";

const UploadFiles: React.FC<uploadImagesComponentProps> = ({
  handleFileChange,
  multipleFiles,
  previewImages,
  fileProgress,
  fileErrors,
  setMultipleFiles,
  setFileFormData,
  fileFormData,
  setFileProgress,
  resumeUpload,
  abortFileUpload,
  abortedFiles,
}) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "text/csv": [],
      "text/plain": [],
    },
  });

  const removeFileAfterAdding = (index: number) => {
    const updatedFiles = multipleFiles.filter((_, i) => i !== index);
    const updatedProgress = { ...fileProgress };
    delete updatedProgress[index];
    setMultipleFiles(updatedFiles);
    setFileProgress(updatedProgress);
    dispatch(removeOneElement(index));
  };

  const retryUpload = (file: File, index: number) => {
    resumeUpload(file, index);
  };

  const handleTextFieldValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const isNumeric = /^\d*$/;
    if (isNumeric.test(value)) {
      setFileFormData((prevData: any) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFileFormData((prevData: any) => ({
        ...prevData,
        [name]: "",
      }));
    }
  };

  const getTotalChunks = (
    chunkSize: number,
    fileSize: number,
    unit: "MB" | "GB"
  ): number => {
    if (chunkSize <= 0 || fileSize <= 0) return 0;

    const chunkSizeInBytes =
      unit === "MB" ? chunkSize * 1024 * 1024 : chunkSize * 1024 * 1024 * 1024;
    setFileFormData((prevData: any) => ({
      ...prevData,
      chunkSizeInBytes,
    }));

    if (chunkSizeInBytes > fileSize) {
      setError("Chunk size cannot be greater than the file size.");
      return 0;
    }

    setError(null);
    return Math.ceil(fileSize / chunkSizeInBytes);
  };

  const handleChunkSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chunkSize = +e.target.value || 0;
    if (chunkSize < 0) return;

    const totalChunks = getTotalChunks(
      chunkSize,
      file[0]?.size || 0,
      fileFormData.unit
    );

    if (chunkSize > file[0]?.size) {
      setError("Chunk size cannot be greater than the file size.");
      return;
    }

    setError(null);
    setFileFormData((prevData: any) => ({
      ...prevData,
      chunkSize: e.target.value,
      totalChunksParts: totalChunks.toString(),
      chunkSizeInBytes:
        chunkSize *
        (fileFormData.unit === "MB" ? 1024 * 1024 : 1024 * 1024 * 1024),
    }));
  };

  const handleUnitChange = (e: any) => {
    const newUnit = e.target.value as "MB" | "GB";
    const chunkSize = +fileFormData.chunkSize || 0;

    if (chunkSize > file[0]?.size) {
      setError("Chunk size cannot be greater than the file size.");
      return;
    }

    setError(null);
    const totalChunks = getTotalChunks(chunkSize, file[0]?.size || 0, newUnit);

    setFileFormData((prevData: any) => ({
      ...prevData,
      unit: newUnit,
      totalChunksParts: totalChunks.toString(),
      chunkSizeInBytes:
        chunkSize * (newUnit === "MB" ? 1024 * 1024 : 1024 * 1024 * 1024),
    }));
  };

  return (
    <div className="upload-files-container">
      <Typography variant="h6">Upload File</Typography>

      <div className="upload-instructions" style={{ cursor: "pointer" }}>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <div>
              <img
                src="/upload-vector.jpg"
                alt="Upload Icon"
                width={100}
                height={100}
              />
              <div>
                <p>
                  <u>Click to upload</u> or drag and drop a file here
                </p>
                {file[0]?.name && (
                  <p className="helperText">File Name: {file[0]?.name}</p>
                )}
                {file[0]?.size && (
                  <p className="helperText">
                    File Size: {bytesToMB(file[0].size).toFixed(2)} MB
                  </p>
                )}
                {file?.length ? (
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label="remove"
                      color="error"
                      onClick={() => {
                        setFile([]);
                        setMultipleFiles([]);
                        removeFileAfterAdding(0);
                        setFileProgress({});
                        setFileFormData({
                          chunkSize: "",
                          unit: "MB",
                          totalChunksParts: "",
                          chunkSizeInBytes: 0,
                        });
                      }}
                    >
                      <DeleteForeverIcon sx={{ color: "#820707" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chunk-settings">
        <TextField
          placeholder="Chunksize"
          type="number"
          disabled={file[0]?.size && multipleFiles?.length == 0 ? false : true}
          value={fileFormData.chunkSize}
          onChange={handleChunkSizeChange}
          size="small"
          name="chunkSize"
          style={{ width: "100px" }}
        />
        <FormControl style={{ minWidth: 100 }}>
          <Select
            value={fileFormData.unit}
            size="small"
            name="unit"
            disabled={
              file[0]?.size && multipleFiles?.length == 0 ? false : true
            }
            onChange={handleUnitChange}
          >
            <MenuItem value="MB">MB</MenuItem>
            <MenuItem value="GB">GB</MenuItem>
          </Select>
        </FormControl>
        <TextField
          placeholder="Parts"
          type="number"
          size="small"
          name="totalChunksParts"
          disabled={file[0]?.size && multipleFiles?.length == 0 ? false : true}
          value={fileFormData.totalChunksParts}
          onChange={handleTextFieldValueChange}
          style={{ width: "100px" }}
          inputProps={{ readOnly: true }}
        />
      </div>

      {error && (
        <Typography variant="subtitle1" color="error">
          {error}
        </Typography>
      )}

      <Button
        sx={{
          display: multipleFiles?.length ? "none" : "",
          marginTop: "8px",
        }}
        variant="contained"
        onClick={() => handleFileChange(file)}
        disabled={
          !file[0]?.size ||
          !fileFormData?.totalChunksParts ||
          !fileFormData?.chunkSize ||
          !!error ||
          +fileFormData?.chunkSize < 5
        }
      >
        Upload
      </Button>

      <div className="file-list">
        {multipleFiles.map((item: File, index: number) => (
          <div className="file-item" key={index}>
            <img
              alt={item.name}
              width={50}
              height={50}
              src={
                previewImages.find((e) => e.fileIndex === item.name)?.previewUrl
                  ? previewImages.find((e) => e.fileIndex === item.name)
                      ?.previewUrl
                  : item.type?.includes("application/pdf")
                  ? "/pdf-icon1.png"
                  : "/doc-icon.png"
              }
            />
            <div className="file-info">
              <Typography variant="body2" color={"textPrimary"}>
                {item.name.slice(0, 9)}...{item.type}
              </Typography>

              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant={"determinate"}
                  value={fileProgress[index]}
                />
                <div className="progress-text">
                  {fileProgress[index]?.toFixed(2)}%
                </div>
              </Box>
              {fileErrors[index] ? (
                <div className="error-message">
                  <Typography variant="body2" color={"error"}>
                    {fileErrors[index].reason || "Upload Failed"}
                  </Typography>
                </div>
              ) : (
                <div>{bytesToMB(item.size).toFixed(2)} MB</div>
              )}
              <div className="file-actions">
                {abortedFiles.has(index) ? (
                  <Typography variant="body2" color="error">
                    Canceled
                  </Typography>
                ) : fileProgress[index] === 100 ? (
                  <div>
                    <IconButton>
                      <DoneIcon sx={{ color: "#05A155" }} />
                    </IconButton>
                    <IconButton onClick={() => removeFileAfterAdding(index)}>
                      <DeleteForeverIcon sx={{ color: "#820707" }} />
                    </IconButton>
                  </div>
                ) : (
                  <div>
                    {fileErrors[index] ? (
                      <Tooltip title="Retry Upload">
                        <IconButton onClick={() => retryUpload(item, index)}>
                          <ReplayIcon sx={{ color: "#FFA500" }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Button
                        variant="text"
                        onClick={() => abortFileUpload(index)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFiles;
