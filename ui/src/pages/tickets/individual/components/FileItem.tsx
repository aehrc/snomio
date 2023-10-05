import {
  Article,
  AttachEmail,
  AttachFile,
  FolderZip,
  Html,
  Panorama,
  PictureAsPdf,
  Slideshow,
  TableRows,
  TextSnippet,
} from '@mui/icons-material';
import { Button, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import AttachmentService from '../../../../api/AttachmentService';

interface FileItemProps {
  filename: string;
  id: number;
}

function FileItem({ id, filename }: FileItemProps) {
  const iconMapping: Record<string, React.ReactNode> = {
    pdf: <PictureAsPdf />,
    jpg: <Panorama />,
    jfif: <Panorama />,
    jpeg: <Panorama />,
    png: <Panorama />,
    webp: <Panorama />,
    avif: <Panorama />,
    doc: <Article />,
    docx: <Article />,
    html: <Html />,
    htm: <Html />,
    msg: <AttachEmail />,
    pptx: <Slideshow />,
    xls: <TableRows />,
    xlsx: <TableRows />,
    sql: <TextSnippet />,
    zip: <FolderZip />,
    default: <AttachFile />,
  };

  const extension = filename.split('.').pop();
  let selectedIcon = iconMapping.default;
  if (extension) {
    selectedIcon = iconMapping[extension.toLocaleLowerCase()];
  }

  const downloadFile = (id: number) => {
    AttachmentService.downloadAttachment(id);
  };

  return (
    <>
      <Grid item xs={2}>
        <Button
          onClick={() => {
            downloadFile(id);
          }}
          sx={{
            mt: 1,
            border: 1,
            padding: 1,
            display: 'block',
            borderStyle: 'dotted',
            borderColor: '#bababa',
            textAlign: 'center',
            color: '#343434',
            overflowWrap: 'break-word',
            minWidth: 150,
            maxWidth: 150,
          }}
        >
          {React.cloneElement(selectedIcon as React.ReactElement, {
            sx: { minHeight: '50px', minWidth: '50px' }, // Add this style to make the icon bigger
          })}
          <Divider />
          <Typography
            align="center"
            variant="caption"
            sx={{
              mt: 1,
              fontSize: '0.8em',
              display: 'inline-block',
              maxWidth: '120px',
            }}
          >
            {filename}
          </Typography>
        </Button>
      </Grid>
    </>
  );
}

export default FileItem;
