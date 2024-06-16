import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { type Field } from '@/types';

interface FieldSelectorProps {
    availableFields: Field[];
    selectedFields: Field[];
    onAddFields: (fields: Field[]) => void;
    onRemoveField: (field: Field) => void;
}

function FieldSelector({ availableFields, selectedFields, onAddFields, onRemoveField }: FieldSelectorProps): React.JSX.Element {
    const handleChange = (event: React.ChangeEvent<unknown>, value: Field[]): void => {
        onAddFields(value);
    };

    return (
        <Autocomplete
            multiple
            options={availableFields}
            value={selectedFields}
            onChange={handleChange}
            getOptionLabel={(option) => option.headerName}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        key={option.field}
                        label={option.headerName}
                        {...getTagProps({ index })}
                        onDelete={() => { onRemoveField(option); }}
                    />
                ))
            }
            renderInput={(params) => <TextField {...params} label="Выберите поля" />}
        />
    );
}

export default FieldSelector;
