import React, { memo, useCallback, useRef } from 'react';
import { isEmpty } from 'lodash';

import RenderComponent from './RenderComponent';
import { useSocket } from '../../helpers/socket';
import Message from '../../components/message/Message';
import Input from '../../components/input/Input';

export const AssistantChat: React.FC = memo(() => {
  const { components, sendMessage } = useSocket();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') {
        return;
      }
      sendMessage('start_flow');
    },
    [sendMessage]
  );

  return (
    <>
      {isEmpty(components) ? (
        <div className='px-4 my-10'>
          <Message className='my-4'>{'Say hi to wake me up'}</Message>
          <Input placeholder='Say hi...' className='w-full' onKeyPress={handleKeyPress} autoFocus />
        </div>
      ) : (
        <div
          ref={containerRef}
          className='h-auto px-4 my-6 overflow-auto text-sm text-gray-300 chatbot-area s0-scrollbar max-h-80'
        >
          <div className='mt-4 mb-6'>
            {components.map((node, index) => (
              <RenderComponent
                containerRef={containerRef}
                key={`last-message-${index}`}
                component={node}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
});
