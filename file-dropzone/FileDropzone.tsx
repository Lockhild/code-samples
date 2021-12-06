import classNames from 'classnames';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';

import Button from '../../components/button/Button';
import { arrayBufferToBase64 } from '../../helpers/utils';
import PdfPreview from '../pdf-preview/PdfPreview';
import { AuthContextProvider } from '../../providers/token.provider';
import { useSocket } from '../../helpers/socket';
import ApiFacade from '../../helpers/ApiFacade';

export interface IFileDropzoneProps {
  className?: string;
  path?: string;
  isPrivate?: boolean;
}

interface IPdfFile {
  base64?: string;
  formData?: FormData;
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 4,
  borderColor: '#4A5872',
  borderStyle: 'dashed',
  backgroundColor: '#1E212F',
  outline: 'none',
  transition: 'all .24s ease-in-out',
};

const activeStyle = {
  borderColor: '#91A1C2',
  backgroundColor: '#282B3D',
};

const acceptStyle = {
  borderColor: '#91A1C2',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const FileDropzone: React.FC<IFileDropzoneProps> = ({
  className,
  path = 'document_templates',
  isPrivate,
}) => {
  const { auth } = useContext(AuthContextProvider);
  const { sendMessage } = useSocket();
  const [pdfFile, setPdfFile] = useState<IPdfFile>({ base64: undefined, formData: undefined });
  const [fileInputIsVisible, setFileInputIsVisible] = useState(true);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      setFileInputIsVisible(false);

      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const fd = new FormData();
        fd.append('file', file, file.path);
        fd.append('path', path);
        fd.append('private', isPrivate ? 'true' : 'false');

        const binaryStr = reader.result;

        if (!binaryStr) {
          return;
        }

        setPdfFile({ base64: arrayBufferToBase64(binaryStr as ArrayBuffer), formData: fd });
      };
    },
    [isPrivate, path]
  );

  const { isDragActive, isDragAccept, isDragReject, acceptedFiles, getRootProps, getInputProps } =
    useDropzone({
      onDropAccepted,
      accept: 'application/pdf',
      multiple: false,
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const file: FileWithPath = useMemo(() => acceptedFiles[0], [acceptedFiles]);

  const onUploadNew = useCallback(() => {
    setFileInputIsVisible(true);
  }, [setFileInputIsVisible]);

  const onFileOk = useCallback(async () => {
    if (!pdfFile.formData) {
      return;
    }

    const api = new ApiFacade(auth.token);
    const fileUrl = await api.upload(pdfFile.formData);

    if (!fileUrl) {
      return;
    }

    sendMessage(fileUrl);
  }, [pdfFile, auth, sendMessage]);

  return (
    <section className={classNames('container', className)}>
      {!fileInputIsVisible && pdfFile.base64 && pdfFile.formData && acceptedFiles.length && (
        <PdfPreview
          file={pdfFile.base64}
          fileName={file.path || 'unknown'}
          onOk={onFileOk}
          onCancel={onUploadNew}
        />
      )}

      {fileInputIsVisible && (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <div className='flex justify-between w-full'>
            <p className='text-s0gray-5'>Drag and drop</p>
            <Button>Browse</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FileDropzone;
