import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Stack, Typography } from '@mui/material';
import EditableTable from '@/components/dashboard/character/table';


export const metadata = { title: `Characters | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return (
      <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        <Typography variant="h4">Characters</Typography>
        <EditableTable />
      </Stack>
    );
  }