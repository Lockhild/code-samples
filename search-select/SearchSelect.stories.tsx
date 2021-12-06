import React from 'react';
import { Meta } from '@storybook/react/types-6-0';

import SearchSelect, { ISearchSelectProps } from './';

export default {
  title: 'chatbot/containers/SearchSelect',
  component: SearchSelect,
} as Meta;

const options = [
  { value: 'teamwork', label: 'Teamwork' },
  { value: 'slack', label: 'Slack' },
  { value: 'discord', label: 'Discord' },
  { value: 'twitch', label: 'Twitch' },
];

export const Primary: React.FC<ISearchSelectProps> = () => <SearchSelect selectOptions={options} />;
