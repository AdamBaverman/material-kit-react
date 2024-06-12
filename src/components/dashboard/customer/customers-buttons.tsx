import * as React from 'react';
import Button from '@mui/material/Button';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Stack } from '@mui/material';
import { type Customer } from './customers-table';

interface CustomersButtonsProps {
    handleOpen: (customer: Customer | null) => void;
    handleFetchCustomers: () => Promise<void>;
}

// export const useButtonsElement = (): React.JSX.Element => {

// }

export function CustomersButtons({ handleOpen, handleFetchCustomers }: CustomersButtonsProps): React.JSX.Element {
    return (
        <Stack spacing={1} direction="row" sx={{ flex: '1 1 auto', alignItems: 'flex-end' }}>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleFetchCustomers}>
                Обновить
            </Button>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => { handleOpen(null); }}>
                Создать
            </Button>
        </Stack >
    );
}

export default CustomersButtons;