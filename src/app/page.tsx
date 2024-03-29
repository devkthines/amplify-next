"use client";
import React, { useState, useRef, useEffect } from "react";
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from '../amplifyconfiguration.json';
import "@aws-amplify/ui-react/styles.css";
// import Nav from '../components/nav'
import Typography from '@mui/material/Typography';

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


export default function Page() {

  return (
    <>
    <main className="">
    
    <Typography variant="h1" gutterBottom sx={{margin: '100px auto', textAlign: 'center'}}>Home  </Typography>

      
      
    </main></>
    
  );
}
// export default withAuthenticator(Home);
