'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DynamicForm from './card';
import axios from 'axios';

// const rows = [
//   { id: 1, name: 'Item 1', description: 'Description 1', extraFields: [{ key: 'field1', value: 'value1' }] },
//   { id: 2, name: 'Item 2', description: 'Description 2', extraFields: [{ key: 'field2', value: 'value2' }] },
// ];

// const columns = [
//   { field: 'name', headerName: 'Name', width: 150 },
//   { field: 'description', headerName: 'Description', width: 200 },
// ];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  extraFields: z.array(z.object({
    key: z.string(),
    value: z.string().min(1, 'Value is required'),
  })),
});

function EditableTable(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });
  const [columns, setColumns] = useState([
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
  ]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchColumns = async (): Promise<void> => {
      try {
        const response = await axios.get('/api/character/columns');
        setColumns(response.data);
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    };

    const fetchRows = async (): Promise<void> => {
      try {
        const response = await axios.get('/api/character/rows');
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching rows:', error);
      }
    };

    fetchColumns();
    // fetchRows();
  }, []);
  
  const handleRowClick = (row): void => {
    setSelectedRow(row);
    reset(row);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const onSubmit = (data): void => {
    console.log(data);
    handleClose();
  };

  return (
    <Box>
      <DataGrid rows={rows} columns={columns} onRowClick={(params) => handleRowClick(params.row)} autoHeight />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <TextField {...field} label="Name" fullWidth margin="normal" />}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => <TextField {...field} label="Description" fullWidth margin="normal" />}
            />
            <DynamicForm control={control} />
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default EditableTable;