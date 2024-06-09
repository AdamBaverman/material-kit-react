import * as React from 'react';
import Button from '@mui/material/Button';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Stack } from '@mui/material';
import { type Customer } from './customers-table';

interface CustomersButtonsProps {
    handleOpen: (customer: Customer | null) => void;
    handleFetchCustomers: () => Promise<void>;
}

export function CustomersButtons({ handleOpen, handleFetchCustomers }: CustomersButtonsProps): React.JSX.Element {
    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                        Import
                    </Button>
                    <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleFetchCustomers}>
                        Export
                    </Button>
                </Stack>
            </Stack >
            <div>
                <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => { handleOpen(null); }}>
                    Add
                </Button>
            </div>
        </Stack >
    );
}