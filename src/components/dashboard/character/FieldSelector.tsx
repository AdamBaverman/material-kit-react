import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { type Field } from '@/types';

interface FieldSelectorProps {
  fields: Field[];
  selectedFields: Field[];
  onChange: (selectedFields: Field[]) => void;
}

function FieldSelector({ fields, selectedFields, onChange }: FieldSelectorProps): React.JSX.Element {
  const handleChange = (field: Field): void => {
    const isSelected = selectedFields.includes(field);
    const updatedFields = isSelected
      ? selectedFields.filter((f) => f !== field)
      : [...selectedFields, field];
    onChange(updatedFields);
  };

  return (
    <div>
      {fields.map((field) => (
        <FormControlLabel
          key={field.field}
          control={
            <Checkbox
              checked={selectedFields.includes(field)}
              onChange={() => { handleChange(field); }}
            />
          }
          label={field.headerName}
        />
      ))}
    </div>
  );
}

export default FieldSelector;
