import 'toastr/build/toastr.css';
import './index.css';

import React, { useCallback, useEffect, useContext, memo, useState } from 'react';
import isEmpty from 'lodash.isempty';

import ScreenRecorder from './components/screen-recorder/ScreenRecorder';
import SuggestionsRow from './containers/suggestions-row/SuggestionsRow';
import VoiceRecorder from './components/voice-recorder/VoiceRecorder';
import { notImplemented } from './helpers/utils';
import { AuthContextProvider, AuthProvider, initialAuth } from './providers/token.provider';
import LoginForm from './containers/login-form/LoginForm';
import AssistantChat from './containers/assistant-chat';
import { closeSocket, openSocket } from './helpers/socket';
import IconButton from './components/icon-button';
import LogoutIcon from './components/svg-components/logout-icon';

export interface IAnyObject {
  [key: string]: any;
}

export interface IChatbotProps {
  wsUrl: string;
  flowId: string;
  apiUrl?: string;
  isScreenRecording?: boolean;
  className?: string;
  onRecord?: () => void;
  onFinishRecording?: () => void;
}

const ChatbotComponent: React.FC<IChatbotProps> = memo((props) => {
  const { isScreenRecording, className, apiUrl, wsUrl, flowId, onRecord, onFinishRecording } =
    props;

  const [isExtension, setIsExtension] = useState(false);
  const { auth, setAuth } = useContext(AuthContextProvider);

  const handleIsExtension = () => {
    setIsExtension(
      !!(
        document.querySelector('#assistant-chrome-extension') ||
        document.querySelector('#assistant-storybook')
      )
    );
  };

  useEffect(() => {
    window.addEventListener('load', () => {
      handleIsExtension();
    });

    return () => {
      window.removeEventListener('load', handleIsExtension);
    };
  }, []);

  const authSetup = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken') || undefined;

    if (token) {
      setAuth({ token, refreshToken });
      return;
    }
  }, [setAuth]);

  useEffect(() => {
    if (flowId) {
      localStorage.setItem('flowId', flowId);
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      openSocket(wsUrl, token);
    }

    authSetup();

    return () => {
      localStorage.removeItem('flowId');
      closeSocket();
    };
  }, [flowId, wsUrl, authSetup]);

  const onLogout = useCallback(() => {
    setAuth(initialAuth);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    if (onFinishRecording) {
      onFinishRecording();
    }
  }, [onFinishRecording, setAuth]);

  return (
    <div id='s0-chatbot' className={className}>
      {isEmpty(auth.token) && apiUrl ? (
        <LoginForm apiUrl={apiUrl} />
      ) : (
        <div className='relative h-full px-4 pt-4 font-sans storybook-height-fix'>
          <div className='w-full bg-transparent border rounded-lg border-s0gray-10'>
            {isExtension && (
              <IconButton
                className='absolute w-10 h-10 rounded-full left-4 bottom-16 bg-s0gray-9 hover:bg-s0gray-9'
                onClick={onLogout}
              >
                <LogoutIcon
                  className='text-s0gray-1 hover:text-white'
                  width={25}
                  height={25}
                  fill='currentColor'
                />
              </IconButton>
            )}

            <VoiceRecorder className='-m-s0-1' label='Voice chat' />
            <AssistantChat />
            <SuggestionsRow
              className='-m-s0-1'
              responses={[]}
              onDashboardClick={notImplemented}
              onSuggestionClick={notImplemented}
            />
          </div>
          <ScreenRecorder
            active={isScreenRecording}
            onClick={onRecord}
            className='absolute bottom-0 left-4 right-4'
          />
        </div>
      )}
    </div>
  );
});

export const Chatbot: React.FC<IChatbotProps> = (props) => (
  <AuthProvider>
    <ChatbotComponent {...props} />
  </AuthProvider>
);

export default Chatbot;
