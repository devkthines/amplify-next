"use client";
import React, { useState, useRef, useEffect } from "react";
import { uploadData } from "aws-amplify/storage";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import {Select,SelectChangeEvent } from '@mui/material';



// import { Amplify } from 'aws-amplify';
// import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
// import { withAuthenticator } from '@aws-amplify/ui-react';

// import config from '../../src/amplifyconfiguration.json';

// Amplify.configure(config, {
//   Storage: {
//     S3: {
//       prefixResolver: async ({ accessLevel, targetIdentityId }) => {
//         if (accessLevel === 'guest') {
//           return '';
//         } else if (accessLevel === 'protected') {
//           return `myProtectedPrefix/${targetIdentityId}/`;
//         } else {
//           return `myPrivatePrefix/${targetIdentityId}/`;
//         }
//       }
//     }
//   }
// });

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function Upload() {
  // export function Home({ signOut, user }: WithAuthenticatorProps) {
  // const [progUploading, setProgUploading] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadFailure, setUploadFailure] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (uploading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer); 
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [uploading]);

  const handleFolderChange = (event: SelectChangeEvent<string>) => {
    setSelectedFolder(event.target.value);
    setUploadSuccess(false);
    setUploadFailure(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadSuccess(false);
    setUploadFailure(false);
    if (event?.target?.files) {
      setFile(event.target.files[0]);
    }
  };
  const uploadDataInBrowser = async () => {
    // const uploadDataInBrowser = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    if (uploading) {
      return; // Do nothing if uploading is already in progress
    }
    if (!file || !selectedFolder) {
      alert("Please select a file to upload.");
      return;
    }

    // if (file && selectedFolder) {
    setUploading(true); // Set uploading state to true when starting upload
    setProgress(0); // Reset progress to 0 at the beginning of upload
    try {
      const result = await uploadData({
        key: `${selectedFolder}/${file.name}`,
        data: file,
        options: {
          contentType: file.type, // Set the content type to video/mp4 for MP4 video files. Adjust accordingly for other video formats.
          contentEncoding: "identity", // Since video files are typically already compressed, set contentEncoding to identity.
          contentDisposition: "attachment", // You can keep this if you want to specify how the browser should handle the downloaded video file.
          metadata: { key: "value" }, // You can include any additional metadata relevant to your application.
          useAccelerateEndpoint: false,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              // console.log(
              //   `Upload progress ${Math.round(
              //     (transferredBytes / totalBytes) * 100
              //   )} %`
              // );
              const calculatedProgress = Math.round(
                (transferredBytes / totalBytes) * 100
              );
              setProgress(calculatedProgress);
            }
          },
        },
      });
      // console.log("Key from Response: ", result);
      setUploadSuccess(true);
    } catch (error) {
      // console.log("Error : ", error);
      setUploadFailure(true);
      setErrorMessage(
        (error as Error).message || "An error occurred during upload."
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploading(false); // Set uploading state to false after upload completes (whether success or failure)
      setProgress(0); // Reset progress to 0 after upload completes (whether success or failure)
      setFile(null); // Reset file state
      setSelectedFolder(""); // Reset folder selection+

      // // Reset uploadSuccess and uploadFailure after 3 seconds
      // // setTimeout(() => {
      //   setUploadSuccess(false);
      //   setUploadFailure(false);
      // // }, 3000);
    }
    // }
  };
  return (
    <>
    {/* <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button> */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  <Grid xs={12} className='text-center'>
  <Typography variant="h1" gutterBottom>Upload a File!  </Typography>
  </Grid>
  <Grid  xs={12}display="flex" justifyContent="space-between" alignItems="center">      
      <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel htmlFor="grouped-native-select">Select a Location</InputLabel>
      <Select
        native
        value={selectedFolder}
        onChange={handleFolderChange}
        disabled={uploading}
        id="grouped-native-select"
        label="Select a Location"
        inputProps={{ id: 'grouped-native-select' }}
      >
          <option  aria-label="None" value=""></option>
          <optgroup label="F4L">
            <option value="001-F4L-MarchLane">001-F4L-MarchLane</option>
            <option value="002-F4L-WilsonWay">002-F4L-WilsonWay</option>
            <option value="003-F4L-Lodi">003-F4L-Lodi</option>
            <option value="004-F4L-WestonRanch">004-F4L-WestonRanch</option>
            <option value="005-F4L-HammerLane">005-F4L-HammerLane</option>
            <option value="006-F4L-Manteca">006-F4L-Manteca</option>
            <option value="007-F4L-LosBanos">007-F4L-LosBanos</option>
            <option value="008-F4L-Salinas">008-F4L-Salinas</option>
            <option value="009-F4L-Ceres">009-F4L-Ceres</option>
            <option value="010-F4L-Atascadero">010-F4L-Atascadero</option>
            <option value="011-F4L-SLO">011-F4L-SLO</option>
            <option value="012-F4L-PasoRobles">012-F4L-PasoRobles</option>
            <option value="013-F4L-ArroyoGrande">013-F4L-ArroyoGrande</option>
            <option value="014-F4L-MackRoad">014-F4L-MackRoad</option>
            <option value="015-F4L-RioLinda">015-F4L-RioLinda</option>
            <option value="016-F4L-RanchoCordova">016-F4L-RanchoCordova</option>
            <option value="017-F4L-Fairfield">017-F4L-Fairfield</option>
            <option value="550-WH-TeslaDrive">550-WH-TeslaDrive</option>
          </optgroup>
          <optgroup label="RSM">
            <option value="021-RSM-Stockton">021-RSM-Stockton</option>
            <option value="022-RSM-Lodi">022-RSM-Lodi</option>
            <option value="023-RSM-Merced">023-RSM-Merced</option>
            <option value="024-RSM-Madera">024-RSM-Madera</option>
            <option value="025-RSM-Greenfield">025-RSM-Greenfield</option>
            <option value="027-RSM-Livingston">027-RSM-Livingston</option>
            <option value="028-RSM-Broadway">028-RSM-Broadway</option>
            <option value="041-RSM-MinimartStockton">
              041-RSM-MinimartStockton
            </option>
          </optgroup>
        </Select>
    </FormControl>
      </div> 
      <div>
      <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file* (5tb max)
      <VisuallyHiddenInput type="file" onChange={handleFileChange}
          ref={fileInputRef}
          disabled={uploading}/>
    </Button>
        {/* <input
          type="file"
          
        /> */}
      </div>
  </Grid>
  <Grid  xs={12} display="flex" justifyContent="center" alignItems="center">
<div>
        {/* <form onSubmit={uploadDataInBrowser}>
      <button
          type="submit"
          disabled={!file || !selectedFolder || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
              </form> */}
        <Button 
        variant="contained"
          onClick={uploadDataInBrowser}
          disabled={!file || !selectedFolder || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <br />
        <br />
        {/* {uploading &&   */}
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            key={progress}
            variant="determinate"
            value={progress}
          />
        </Box>
        {/* } */}
        {uploadSuccess && (
          <Paper elevation={3} className="text-center">
            <CheckIcon style={{ color: "green" }} />
            <h1 style={{ color: "green" }}>Upload Successful!</h1>
          </Paper>
        )}
        {uploadFailure && (
          <Paper elevation={3} className="text-center">
            <ClearIcon style={{ color: "red" }} />
            <p style={{ color: "red" }}>{errorMessage}</p>
          </Paper>
        )}
      </div>
  </Grid>
</Grid>
      

      
      
    </>
  );
}
// export default withAuthenticator(Home);
