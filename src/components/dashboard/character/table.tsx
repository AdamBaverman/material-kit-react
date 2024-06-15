'use client';

import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const rows = [
  { id: 1, name: 'Item 1', description: 'Description 1' },
  { id: 2, name: 'Item 2', description: 'Description 2' },
];

const columns = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'description', headerName: 'Description', width: 200 },
];

const EditableTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { control, handleSubmit, reset } = useForm();

  const handleRowClick = (row) => {
    setSelectedRow(row);
    reset(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
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
            {/* Add more fields as needed */}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EditableTable;
