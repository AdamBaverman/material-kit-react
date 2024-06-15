import React, { useState } from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { Box, Button, TextField, Autocomplete } from '@mui/material';

const availableFields = [
  { key: 'field1', label: 'Field 1' },
  { key: 'field2', label: 'Field 2' },
  { key: 'field3', label: 'Field 3' },
];

function DynamicForm({ control }): React.JSX.Element {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'extraFields',
  });

  const [selectedFields, setSelectedFields] = useState([]);

  const handleAddFields = () => {
    selectedFields.forEach((field) => {
      append({ key: field.key, value: '' });
    });
    setSelectedFields([]);
  };

  return (
    <div>
      <Autocomplete
        multiple
        options={availableFields}
        getOptionLabel={(option) => option.label}
        value={selectedFields}
        onChange={(event, newValue) => {
          setSelectedFields(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Select Fields" variant="outlined" margin="normal" />}
      />
      <Button type="button" onClick={handleAddFields} disabled={selectedFields.length === 0}>
        Add Fields
      </Button>
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" alignItems="center">
          <Controller
            name={`extraFields[${index}].value`}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={availableFields.find((f) => f.key === field.key)?.label || 'Value'}
                variant="outlined"
                margin="normal"
              />
            )}
          />
          <Button type="button" onClick={() => remove(index)}>Delete</Button>
        </Box>
      ))}
    </div>
  );
}

export default DynamicForm;
