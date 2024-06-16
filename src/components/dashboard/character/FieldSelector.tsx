import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { type Field } from '@/types';

interface FieldSelectorProps {
    availableFields: Field[];
    onAddField: (fields: Field) => void;
}

function FieldSelector({ availableFields, onAddField }: FieldSelectorProps): React.JSX.Element {
    const handleAddField: (event: React.ChangeEvent<NonNullable<unknown>>, value: Field | null) => void = (
        event,
        value
    ) => {
        if (value) {
            onAddField(value);
        }
    };

    return (
        <Autocomplete
            options={availableFields}
            getOptionLabel={(option) => option.headerName}
            renderInput={(params) => <TextField {...params} label="Добавить поле" />}
            onChange={handleAddField}
        />
    );
}

export default FieldSelector;
