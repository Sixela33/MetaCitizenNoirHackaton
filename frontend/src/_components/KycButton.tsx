'use client'
import { useState } from 'react'
import SumsubWebSdk from '@sumsub/websdk-react'
import axiosInstance from '../utils/axios';

// https://docs.sumsub.com/docs/get-started-with-web-sdk
export default function KycButton() {
  const [accessToken, setAccessToken] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const generateAccessToken = async () => {
    try {
      const response = await axiosInstance.get('sumsub/access-token');

      console.log('response', response);
      
      setAccessToken(response.data.token);
      setShowVerification(true);
    } catch (error) {
      console.error('Failed to generate access token:', error);
    }
  }

  const config = {
    lang: 'en',
  }

  const options = {
    addViewportTag: false,
    adaptIframeHeight: true,
  }

  const messageHandler = (message: any) => {
    console.log('messageHandler', message);
    // Track session ID when available
    if (message.idDocumentStatus?.reviewResult?.sessionId) {
      const newSessionId = message.idDocumentStatus.reviewResult.sessionId;
      sendSessionIdToBackend(newSessionId);
    }
  }

  const sendSessionIdToBackend = async (id: string) => {
    try {
      await fetch('/api/kyc/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: id }),
      });
    } catch (error) {
      console.error('Failed to send session ID:', error);
    }
  }

  const errorHandler = (error: any) => {
    console.log('errorHandler', error);
  }

  return (
    <div>
      {!showVerification ? (
        <button onClick={generateAccessToken} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Start Verification
        </button>
      ) : (
        <div className="">
          {accessToken && <SumsubWebSdk
            accessToken={accessToken}
            expirationHandler={generateAccessToken}
            config={config}
            options={options}
            onMessage={messageHandler}
            onError={errorHandler}
          />}
        </div>
      )}
    </div>
  )
}
