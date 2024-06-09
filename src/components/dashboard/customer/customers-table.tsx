'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { styled, useTheme, type Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import { useSelection } from '@/hooks/use-selection';
import { fadeIn, fadeOut } from '@/styles/theme/animations/customer-avatar';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomersButtons } from '@/components/dashboard/customer/customers-buttons'
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';

export interface Customer {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  address: {
    city: string;
    state: string;
    country: string;
    street: string;
  };
  phone: string;
  createdAt: Date;
}

const AnimatedAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'hovered',
})<{ hovered: boolean; theme: Theme }>(({ hovered, theme }) => ({
  transition: 'transform 0.3s',
  transform: hovered ? 'scale(1.2)' : 'scale(1)',
  animation: hovered ? `${fadeIn(theme)} 0.6s forwards` : `${fadeOut(theme)} 0.3s forwards`,
}));

export function CustomersTable(): React.JSX.Element {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [hoveredState, setHoveredState] = React.useState<Record<string, boolean>>({});

  // ===============  CUSTOMER EDITOR  ===============
  const handleOpen = (customer: Customer | null = null): void => {
    if (customer) {
      setCurrentCustomer(customer);
    } else {
      setCurrentCustomer({
        id: '',
        avatar: '',
        name: '',
        email: '',
        address: {
          city: '',
          state: '',
          country: '',
          street: ''
        },
        phone: '',
        createdAt: new Date()
      });
    }
    setIsEditing(Boolean(customer));
    setOpen(true);
  };

  const handleClose = (): void => { setOpen(false); }; //TODO add AlertDialog: https://mui.com/material-ui/react-dialog/#system-AlertDialog.tsx

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setCurrentCustomer((prev) => {
      if (!prev) return null;
      const [mainKey, subKey] = name.split('.');
      if (subKey) {
        return { ...prev, [mainKey]: { ...prev[mainKey], [subKey]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async (): Promise<void> => {
    if (!currentCustomer) return;

    const { name, phone } = currentCustomer;
    if (!name.trim() || !phone.trim()) {
      console.error('All fields are required'); //TODO add error message (red field border)
      return;
    }

    const payload = {
      ...currentCustomer,
      id: currentCustomer.id || undefined,
    };

    try {
      const response = await fetch('/api/customers', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedCustomer = await response.json();
        setCustomers((prev) =>
          isEditing
            ? prev.map((c) => (c.id === savedCustomer.id ? savedCustomer : c))
            : [...prev, savedCustomer]
        );
        handleClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to save customer:', errorData);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  // обращение к api
  const fetchCustomers = async (): Promise<void> => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        console.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // хэндлер для загрузки данных
  const handleFetchCustomers = async (): Promise<void> => {
    console.log('Fetching customers');
    await fetchCustomers();
  };

  // нужно для выбора в чекбоксе (мемоизированный список id)
  const rowIds = React.useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
  
  // Прожатие галочек
  const { selectAll, deselectAll, selectOne, deselectOne, selected, selectedAny, selectedAll } = useSelection(rowIds);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      selectAll();
    } else {
      deselectAll();
    }
  };
  const handleSelectOne = (event: React.ChangeEvent<HTMLInputElement>, id: string): void => {
    if (event.target.checked) {
      selectOne(id);
    } else {
      deselectOne(id);
    }
  };
  // Анимация аватарки
  const handleHover = (id: string, hovered: boolean): void => {
    setHoveredState((prev) => ({ ...prev, [id]: hovered }));
  };

  // ================= PAGINATION =================
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPage = parseInt(searchParams.get('page')!) || 0;
  const queryRowsPerPage = parseInt(searchParams.get('rowsPerPage')!) || 5;
  const handleChangePage = (event: unknown, newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('rowsPerPage', event.target.value);
    params.set('page', '0');
    router.push(`?${params.toString()}`);
  };
  const paginatedCustomers = applyPagination(customers, queryPage, queryRowsPerPage);

  return (
    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
      <CustomersFilters ButtonsElement={<CustomersButtons handleOpen={handleOpen} handleFetchCustomers={handleFetchCustomers} />} />
      {/* <CustomersButtons handleOpen={handleOpen} handleFetchCustomers={handleFetchCustomers} /> */}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedAny}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Signed Up</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((row) => {
                const isSelected = selected?.has(row.id);

                return (
                  <TableRow hover key={row.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => { handleSelectOne(event, row.id); }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <AnimatedAvatar
                          src={row.avatar}
                          onClick={() => { handleOpen(row); }}
                          onMouseEnter={() => { handleHover(row.id, true); }}
                          onMouseLeave={() => { handleHover(row.id, false); }}
                          hovered={hoveredState[row.id] || false}
                          theme={theme}
                        />
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      {[row.address.city, row.address.state, row.address.country].filter(Boolean).join(', ') || 'homeless'}
                    </TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={customers.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={queryPage}
          rowsPerPage={queryRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        {/* CUSTOMER EDITOR */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Name" name="name" fullWidth value={currentCustomer?.name || ''} onChange={handleChange} />
            <TextField margin="dense" label="Email" name="email" fullWidth value={currentCustomer?.email || ''} onChange={handleChange} />
            <TextField margin="dense" label="City" name="address.city" fullWidth value={currentCustomer?.address.city || ''} onChange={handleChange} />
            <TextField margin="dense" label="State" name="address.state" fullWidth value={currentCustomer?.address.state || ''} onChange={handleChange} />
            <TextField margin="dense" label="Country" name="address.country" fullWidth value={currentCustomer?.address.country || ''} onChange={handleChange} />
            <TextField margin="dense" label="Street" name="address.street" fullWidth value={currentCustomer?.address.street || ''} onChange={handleChange} />
            <TextField margin="dense" label="Phone" name="phone" fullWidth value={currentCustomer?.phone || ''} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}