'use client'
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from '../../src/amplifyconfiguration.json';
import { uploadData } from 'aws-amplify/storage';

Amplify.configure(config, {
  Storage: {
    S3: {
      prefixResolver: async ({ accessLevel, targetIdentityId }) => {
        if (accessLevel === 'guest') {
          return '';
        } else if (accessLevel === 'protected') {
          return `myProtectedPrefix/${targetIdentityId}/`;
        } else {
          return `myPrivatePrefix/${targetIdentityId}/`;
        }
      }
    }
  }
});

export function Home({ signOut, user }: WithAuthenticatorProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      setFile(event.target.files[0]);
    }
  };


  const uploadDataInBrowser = async () => {
    if (file && selectedFolder) {
      setUploading(true);
      try {
        const result = await uploadData({
          key: `${selectedFolder}/${file.name}`,
          data: file,
          options: {contentType: file.type, // Set the content type to video/mp4 for MP4 video files. Adjust accordingly for other video formats.
          contentEncoding: "identity", // Since video files are typically already compressed, set contentEncoding to identity.
          contentDisposition: "attachment", // You can keep this if you want to specify how the browser should handle the downloaded video file.
          metadata: { key: "value" }, // You can include any additional metadata relevant to your application.
          useAccelerateEndpoint: false,
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(
                  `Upload progress ${
                    Math.round((transferredBytes / totalBytes) * 100)
                  } %`
                );
              }
            }
          }
        });
        console.log('Key from Response: ', result);
      } catch (error) {
        console.log('Error : ', error);
      }
      finally {
        setUploading(false);
        setFile(null); // Reset file state
        setSelectedFolder(''); // Reset folder selection
      }
    }
  };
  
  return (
    <main >
     <h1>Hello {user?.username}</h1>
     
      <button onClick={signOut}>Sign out</button>
      <div>
        <select value={selectedFolder} onChange={handleFolderChange}>
        <option value="">Select Folder</option>
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
    <option value="041-RSM-MinimartStockton">041-RSM-MinimartStockton</option>
  </optgroup>
        </select>
      </div>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div>
        <button onClick={() => uploadDataInBrowser()} disabled={!file || !selectedFolder || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </main>
  );
}
export default withAuthenticator(Home);
