import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
      <Typography variant="h4">Customers</Typography>
      <CustomersTable />
    </Stack>
  );
}