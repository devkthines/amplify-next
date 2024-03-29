// 'use client'
// import {useState, useEffect} from 'react';

// import { list } from 'aws-amplify/storage';
// import { getUrl } from 'aws-amplify/storage';
// import { CopyToClipboard } from "react-copy-to-clipboard";

// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

// const drawerWidth = 240;

// interface StorageItem {
//     key: string;
//     // Define other properties of your storage item if available
//   }
  
//   interface FilesystemItem {
//     __data?: StorageItem;
//     [key: string]: FilesystemItem | StorageItem | undefined;
  
//   }
// export default function Download(){  
//   function processStorageList(response: { items: StorageItem[] }): FilesystemItem {
//     const filesystem: FilesystemItem = {};
  
//     const add = (source: string, target: FilesystemItem, item: StorageItem) => {
//       const elements = source.split('/');
//       const element = elements.shift();
//       if (!element) return; // blank
//       target[element] = target[element] || { __data: item };
//       if (elements.length) {
//         target[element] =
//           typeof target[element] === 'object' ? target[element] : {};
//         add(elements.join('/'), target[element] as FilesystemItem, item);
//       }
//     };
  
//     response.items.forEach((item) => add(item.key, filesystem, item));
//     return filesystem;
//   }
  
//   const FileSystemViewer: React.FC = () => {
//     const [filesystem, setFilesystem] = useState<Record<string, FilesystemItem>>({});
  
//     useEffect(() => {
//       async function fetchFileSystem() {
//         try {
//           const result = await list({
//             prefix: 'photos/'
//           });
//           const processedFilesystem = processStorageList(result);
//           setFilesystem(processedFilesystem);
//         } catch (error) {
//           console.log(error);
//         }
//       }
//       fetchFileSystem();
//     }, []);
  
//     const renderFilesystem = (filesystem: Record<string, FilesystemItem>) => {
//       return (
//         <ul>
//           {Object.entries(filesystem).map(([key, value]) => (
//             <li key={key}>
//               {key}
//               {value && typeof value === 'object' ? renderFilesystem(value) : null}
//             </li>
//           ))}
//         </ul>
//       );
//     };

   

//     return(

//         <>
//         <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
//       >
//         <Toolbar>
//           <Typography variant="h6" noWrap component="div">
//             Permanent drawer
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             boxSizing: 'border-box',
//           },
//         }}
//         variant="permanent"
//         anchor="left"
//       >
//         <Toolbar />
//         <Divider />
//         <List>
//           {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//             <ListItem key={text} disablePadding>
//               <ListItemButton>
//                 <ListItemIcon>
//                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//                 </ListItemIcon>
//                 <ListItemText primary={text} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//         <Divider />
//         <List>
//           {['All mail', 'Trash', 'Spam'].map((text, index) => (
//             <ListItem key={text} disablePadding>
//               <ListItemButton>
//                 <ListItemIcon>
//                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//                 </ListItemIcon>
//                 <ListItemText primary={text} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>
//       <Box
//         component="main"
//         sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
//       >
//         <Toolbar />
//         {/* <Typography paragraph>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
//           tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
//           enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
//           imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
//           Convallis convallis tellus id interdum velit laoreet id donec ultrices.
//           Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
//           adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
//           nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
//           leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
//           feugiat vivamus at augue. At augue eget arcu dictum varius duis at
//           consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
//           sapien faucibus et molestie ac.
//         </Typography>
//         <Typography paragraph>
//           Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
//           eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
//           neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
//           tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
//           sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
//           tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
//           gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
//           et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
//           tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
//           eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
//           posuere sollicitudin aliquam ultrices sagittis orci a.
//         </Typography> */}
//           <h1>File System Viewer</h1>
//       {renderFilesystem(filesystem)}
//       </Box>
//     </Box>
//         </>
//     )
// }


import React, { useEffect, useState } from 'react';
import { list } from 'aws-amplify/storage';

// interface StorageItem {
//   key: string;
//   // Define other properties of your storage item if available
// }

// interface FilesystemItem {
//   __data?: StorageItem;
//   [key: string]: FilesystemItem | StorageItem | undefined;
// }
export default function Download(){
// function Download(response: { items: StorageItem[] }): FilesystemItem {
//   const filesystem: FilesystemItem = {};

//   const add = (source: string, target: FilesystemItem, item: StorageItem) => {
//     const elements = source.split('/');
//     const element = elements.shift();
//     if (!element) return; // blank
//     target[element] = target[element] || {};
//     if (elements.length) {
//       target[element] =
//         typeof target[element] === 'object' ? target[element] : {};
//       add(elements.join('/'), target[element] as FilesystemItem, item);
//     } else {
//       target[element] = { __data: item };
//     }
//   };

//   response.items.forEach((item) => add(item.key, filesystem, item));
//   return filesystem;
// }

// const FileSystemViewer: React.FC = () => {
//   const [filesystem, setFilesystem] = useState<FilesystemItem>({});

//   useEffect(() => {
//     async function fetchFileSystem() {
//       try {
//         const result = await list({
//           prefix: ''
//         });
//         const processedFilesystem = processStorageList(result);
//         setFilesystem(processedFilesystem);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchFileSystem();
//   }, []);

//   const renderFilesystem = (filesystem: FilesystemItem) => {
//     return (
//       <ul>
//         {Object.entries(filesystem).map(([key, value]) => (
//           <li key={key}>
//             {key}
//             {value && typeof value === 'object' ? renderFilesystem(value) : null}
//           </li>
//         ))}
//       </ul>
//     );
//   };

  return (
    <div>
      <h1>File System Viewer</h1>
      {/* {renderFilesystem(filesystem)} */}
    </div>
  );
};

