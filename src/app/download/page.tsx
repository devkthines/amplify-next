'use client'
import { list } from 'aws-amplify/storage';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;


// Define interface for storage item
interface StorageItem {
  key: string;
  // Add other properties as needed
}

// Define interface for filesystem
interface Filesystem {
  [key: string]: any;
}

// Define your processStorageList function
function processStorageList(response: { items: StorageItem[] }): Filesystem {
  const filesystem: Filesystem = {};
  const add = (source: string, target: Filesystem, item: StorageItem) => {
    const elements = source.split('/');
    const element = elements.shift();
    if (!element) return;
    target[element] = target[element] || { __data: item };
    if (elements.length) {
      target[element] =
        typeof target[element] === 'object' ? target[element] : {};
      add(elements.join('/'), target[element], item);
    }
  };
  response.items.forEach((item) => add(item.key, filesystem, item));
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
        const processedData = processStorageList(result);
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
       <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* <AppBar
        // position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            margin: '100px 0'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    <h1>Storage Data</h1>
      {storageData ? (
        <pre>{JSON.stringify(storageData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  
    </div>
  );
}
