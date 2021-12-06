import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import env from './Chatbot.stories.config.json';

import { Chatbot } from './Chatbot';

export default {
  title: 'chatbot/Chatbot',
  component: Chatbot,
} as Meta;

export const Default: React.FC<React.ButtonHTMLAttributes<HTMLInputElement>> = () => (
  <Chatbot flowId='teamwork_flow' wsUrl={env.WS_URL} apiUrl={env.API_URL} />
);
