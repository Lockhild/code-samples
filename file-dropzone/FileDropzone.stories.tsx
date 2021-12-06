import React from 'react';
import { Meta } from '@storybook/react/types-6-0';

import FileDropzone, { IFileDropzoneProps } from './FileDropzone';

export default {
  title: 'chatbot/containers/FileDropzone',
  component: FileDropzone,
} as Meta;

export const Default: React.FC<IFileDropzoneProps> = () => <FileDropzone />;
