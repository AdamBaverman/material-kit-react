import * as React from 'react';
import Button from '@mui/material/Button';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Box, Stack } from '@mui/material';
import { type Customer } from './customers-table';

interface CustomersButtonsProps {
    handleOpen: (customer: Customer | null) => void;
    handleFetchCustomers: () => Promise<void>;
}

// export const useButtonsElement = (): React.JSX.Element => {

// }

export function CustomersButtons({ handleOpen, handleFetchCustomers }: CustomersButtonsProps): React.JSX.Element {
    return (
        <Stack spacing={3} direction="row-reverse" sx={{ flex: '1 1 auto' }}>
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
            <Box component="div" sx={{ display: 'inline-flex', msFlexDirection: 'row-reverse', flexDirection: 'row' }}>
                <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => { handleOpen(null); }}>
                    Add
                </Button>
            </Box>
        </Stack >
    );
}

export default CustomersButtons;