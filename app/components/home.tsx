'use client'
import { Amplify } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from '../../src/amplifyconfiguration.json';
Amplify.configure(config);
import { uploadData } from 'aws-amplify/storage';

export function Home({ signOut, user }: WithAuthenticatorProps) {
  const uploadDataInBrowser = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      const file = event.target.files[0];
      console.log(file)
      console.log('uploadData function: ', uploadData)
      try {
        const result = await uploadData({
          key: file.name,
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
    }
  };
  
  return (
    <main >
     <h1>Hello {user?.username}</h1>
     
      <button onClick={signOut}>Sign out</button>


      <div>
      <input type="file" onChange={uploadDataInBrowser} />
    </div>
    </main>
  );
}
export default withAuthenticator(Home);
