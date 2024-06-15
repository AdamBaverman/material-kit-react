'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { styled, useTheme, type Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { fadeIn, fadeOut } from '@/styles/theme/animations/customer-avatar';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomersButtons } from '@/components/dashboard/customer/customers-buttons'
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import CustomerEditor from './customer-editor';

export interface Customer {
  id: string;
  avatar?: string;
  name: string;
  description: string;
  email?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    street?: string;
  };
  phone?: string;
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [hoveredState, setHoveredState] = React.useState<Record<string, boolean>>({});
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);

  // ===============  CUSTOMER EDITOR  ===============
  // const handleOpen = (customer?: Customer): void => {
  //   if (customer) {
  //     setCurrentCustomer(customer);
  //     setInitialCustomer(customer);
  //   } else {
  //     const newCustomer = {
  //       id: '',
  //       // avatar: '',
  //       name: '',
  //       description: '',
  //       // email: '',
  //       // address: {
  //       //   city: '',
  //       //   state: '',
  //       //   country: '',
  //       //   street: ''
  //       // },
  //       // phone: ''
  //     };
  //     setCurrentCustomer(newCustomer);
  //     setInitialCustomer(newCustomer);
  //   }
  //   setIsEditing(Boolean(customer));
  //   setOpen(true);
  // };

  // const isEdited = (): boolean => {
  //   // console.log('isEdited', {currentCustomer, initialCustomer});
  //   return JSON.stringify(currentCustomer) !== JSON.stringify(initialCustomer);
  // };

  // const handleAlert = (): void => {
  //   if (isEdited()) {
  //     setAlertOpen(true);
  //   } else {
  //     handleClose();
  //   }
  // };

  // const handleAlertClose = (): void => {
  //   setAlertOpen(false);
  // };

  // const handleAlertConfirm = (): void => {
  //   setAlertOpen(false);
  //   void handleSave();
  // };

  // const handleClose = (): void => {
  //   setOpen(false);
  //   setAlertOpen(false);
  // };

  // /**
  //  * Handles changes to the current customer's data.
  //  *
  //  * This function is called whenever the user updates a field in the customer form. It updates the `currentCustomer` state with the new value from the input event.
  //  *
  //  * If the input field is a nested property (e.g. `address.city`), the function updates the corresponding nested property in the `currentCustomer` object. Otherwise, it updates the top-level property.
  //  *
  //  * @param event - The React change event object containing the updated field name and value.
  //  */
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   const { name, value } = event.target;
  //   setCurrentCustomer((prev) => {
  //     if (!prev) return null;
  //     const [mainKey, subKey] = name.split('.');
  //     if (subKey) {
  //       return { ...prev, [mainKey]: { ...prev[mainKey], [subKey]: value } };
  //     }
  //     return { ...prev, [name]: value };
  //   });
  // };

  // /**
  //  * Saves the current customer data to the server.
  //  *
  //  * This function is responsible for handling the save operation for the current customer. It first checks if the customer data has been edited, and if so, it validates the required fields (name and phone). If the validation passes, it sends the updated customer data to the server using a fetch request. Depending on whether the customer is being edited or created, it uses the appropriate HTTP method (PUT or POST).
  //  *
  //  * If the save operation is successful, the function updates the customers list in the state, either by updating the existing customer or adding a new one. If there is an error, it logs the error to the console.
  //  *
  //  * @returns {Promise<void>} A Promise that resolves when the save operation is complete.
  //  */
  // const handleSave = async (): Promise<void> => {
  //   if (!currentCustomer) return;

  //   // changes?
  //   if (!isEdited()) {
  //     console.error('All fields aren\'t changed');
  //     return;
  //   }

  //   // validate
  //   const { name, description } = currentCustomer;
  //   if (!name.trim() || !description.trim()) {
  //     console.error('All fields are required'); //TODO add error message (red field border)
  //     return;
  //   }

  //   const payload = {
  //     ...currentCustomer,
  //     id: currentCustomer.id || undefined,
  //   };

  //   try {
  //     const response = await fetch('/api/customers', {
  //       method: isEditing ? 'PUT' : 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.ok) {
  //       const savedCustomer = await response.json();
  //       setCustomers((prev) =>
  //         isEditing
  //           ? prev.map((c: Customer) => (c.id === savedCustomer.id ? savedCustomer : c))
  //           : [...prev, savedCustomer as Customer]
  //       );
  //       handleClose();
  //     } else {
  //       const errorData = await response.json();
  //       console.error('Failed to save customer:', errorData);
  //     }
  //   } catch (error) {
  //     console.error('An error occurred:', error);
  //   }
  // };
  // обращение к api
  const fetchCustomers = async (): Promise<void> => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        setAllCustomers(data); // Сохраняем исходный список
      } else {
        console.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // хэндлер для загрузки данных
  const handleFetchCustomers = async (): Promise<void> => {
    // console.log('Fetching customers');
    await fetchCustomers();
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

  // ================= SEARCH =================
  const handleSearch = async (name: string): Promise<void> => {
    if (name.length === 0) {
      setCustomers(allCustomers); // Reset to original list if search is empty
      return;
    }
    const filteredCustomers = allCustomers.filter((customer) => {
      const customerName = customer.name.toLowerCase();
      return customerName.includes(name.toLowerCase());
    });
    setCustomers(filteredCustomers);
  };

  return (
    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
      <CustomersFilters onSearch={handleSearch} ButtonsElement={<CustomersButtons handleOpen={handleOpen} handleFetchCustomers={handleFetchCustomers} />} />
      {/* <CustomersButtons handleOpen={handleOpen} handleFetchCustomers={handleFetchCustomers} /> */}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 9 }}>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((row) => {

                return (
                  <TableRow hover key={row.id} >
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
                    <TableCell>{
                      `${String(row.description).substring(0, 10)}...`}</TableCell>
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
        {/* <Dialog open={open} onClose={handleAlert}>
          <DialogTitle>{isEditing ? 'Редактирование' : 'Создание'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Имя" name="name" fullWidth value={currentCustomer?.name || ''} onChange={handleChange} />
            <TextField margin="dense" label="Email" name="email" fullWidth value={currentCustomer?.email || ''} onChange={handleChange} />
            <TextField margin="dense" label="City" name="address.city" fullWidth value={currentCustomer?.address.city || ''} onChange={handleChange} />
            <TextField margin="dense" label="State" name="address.state" fullWidth value={currentCustomer?.address.state || ''} onChange={handleChange} />
            <TextField margin="dense" label="Country" name="address.country" fullWidth value={currentCustomer?.address.country || ''} onChange={handleChange} />
            <TextField margin="dense" label="Street" name="address.street" fullWidth value={currentCustomer?.address.street || ''} onChange={handleChange} />
            <TextField margin="dense" label="Phone" name="phone" fullWidth value={currentCustomer?.phone || ''} onChange={handleChange} />
            <TextField margin="dense" label="Description" name="description" fullWidth value={currentCustomer?.description || ''} onChange={handleChange} />
          </DialogContent>
          <Container >
          </Container>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button disabled={!isEdited()} onClick={handleSave}>Сохранить</Button>
          </DialogActions>
        </Dialog> */}
        <CustomerEditor
          // open={open}
          customer={currentCustomer}
          // isEditing={isEditing}
          // isEdited={isEdited()}
          // onClose={handleAlert}
          // onSave={handleSave}
          // onChange={handleChange}
          // onCancel={handleClose}
        />
      </Card>
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}