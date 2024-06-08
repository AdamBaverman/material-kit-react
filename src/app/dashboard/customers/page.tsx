"use client";
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
// import dayjs from 'dayjs';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';


// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
          // console.log('customers:',data.length);
        } else {
          console.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchCustomers();
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryPage = parseInt(searchParams.get('page')!) || 0;
  const queryRowsPerPage = parseInt(searchParams.get('rowsPerPage')!) || 5;

  const handleChangePage = (event: unknown, newPage: number) => {
    // console.log('newPage:', newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('event:', event.target.value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('rowsPerPage', event.target.value);
    params.set('page', '0'); // Reset to the first page
    router.push(`?${params.toString()}`);
  };
  const handleOpen = (customer: Customer | null = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setIsEditing(true);
    } else {
      setCurrentCustomer({
        id: '',
        name: '',
        email: '',
        address: { city: '', state: '', country: '', street: '' },
        phone: '',
        createdAt: new Date(),
      });
      setIsEditing(false);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = async () => {
    if (!currentCustomer) return;

    const { name, phone, id } = currentCustomer;
    if (!name.trim() || !phone.trim()) {
      console.error('All fields are required');
      return;
    }
    // console.log('id:',id)
    const payload = {
      ...currentCustomer,
      id: currentCustomer.id || undefined, // Убедимся, что `id` корректно передан
    };
    console.log('payload:', payload)
    try {
      const response = await fetch('/api/customers', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const savedCustomer = await response.json();
        setCustomers((prev) => isEditing ? prev.map(c => c.id === savedCustomer.id ? savedCustomer : c) : [...prev, savedCustomer]);
        handleClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to save customer:', errorData);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const paginatedCustomers = applyPagination(customers, queryPage, queryRowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => handleOpen(null)}>
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={customers.length}
        page={queryPage}
        rows={paginatedCustomers}
        rowsPerPage={queryRowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEdit={(customer: Customer) => handleOpen(customer)}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" fullWidth value={currentCustomer?.name || ''} onChange={handleChange} />
          <TextField margin="dense" label="Email" name="email" fullWidth value={currentCustomer?.email || ''} onChange={handleChange} />
          <TextField margin="dense" label="City" name="city" fullWidth value={currentCustomer?.address.city || ''} onChange={handleChange} />
          <TextField margin="dense" label="State" name="state" fullWidth value={currentCustomer?.address.state || ''} onChange={handleChange} />
          <TextField margin="dense" label="Country" name="country" fullWidth value={currentCustomer?.address.country || ''} onChange={handleChange} />
          <TextField margin="dense" label="Street" name="street" fullWidth value={currentCustomer?.address.street || ''} onChange={handleChange} />
          <TextField margin="dense" label="Phone" name="phone" fullWidth value={currentCustomer?.phone || ''} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
