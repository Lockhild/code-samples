import React from 'react';
import { Meta } from '@storybook/react/types-6-0';

import AssistantChat from './';

export const Default: React.FC = () => <AssistantChat />;

const meta: Meta = {
  title: 'chatbot/containers/AssistantChat',
  component: AssistantChat,
};

export default meta;
