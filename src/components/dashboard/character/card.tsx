import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const DynamicForm = () => {
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      items: [{ name: '', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" alignItems="center">
          <Controller
            name={`items[${index}].name`}
            control={control}
            render={({ field }) => <TextField {...field} label="Name" variant="outlined" margin="normal" />}
          />
          <Controller
            name={`items[${index}].value`}
            control={control}
            render={({ field }) => <TextField {...field} label="Value" variant="outlined" margin="normal" />}
          />
          <Button type="button" onClick={() => remove(index)}>Delete</Button>
        </Box>
      ))}
      <Button type="button" onClick={() => append({ name: '', value: '' })}>
        Add Item
      </Button>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default DynamicForm;
