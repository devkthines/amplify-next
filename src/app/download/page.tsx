'use client'
import { getUrl } from 'aws-amplify/storage';
import { useState, useEffect } from 'react';

// Define interface for storage item
interface StorageItem {
  key: string;
  // Add other properties as needed
}

// Define interface for filesystem
interface Filesystem {
  [key: string]: string;
}

// Define your processStorageList function
async function processStorageList(response: { items: StorageItem[] }): Promise<Filesystem> {
  const filesystem: Filesystem = {};
  for (const item of response.items) {
    // Assuming 'item.key' represents the full path to the file
    const cloudFrontLink = await getUrl({ key: item.key });
    filesystem[item.key] = cloudFrontLink.url;
  }
  return filesystem;
}

// Define your Next.js functional component
export default function YourComponent() {
  const [storageData, setStorageData] = useState<Filesystem | null>(null);

  // useEffect hook to fetch storage data when the component mounts
  useEffect(() => {
    async function fetchStorageData() {
      try {
        const result = await list({ prefix: '' });
        const processedData = await processStorageList(result);
        setStorageData(processedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchStorageData();
  }, []);

  // Render your UI using the storageData state
  return (
    <div>
      <h1>Storage Data</h1>
      {storageData ? (
        <ul>
          {Object.entries(storageData).map(([key, cloudFrontLink]) => (
            <li key={key}>
              <a href={cloudFrontLink} target="_blank" rel="noopener noreferrer">{key}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
