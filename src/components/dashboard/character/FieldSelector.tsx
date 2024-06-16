import React, { useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import { type Field } from '@/types';

interface FieldSelectorProps {
    availableFields: Field[];
    onAddFields: (fields: Field[]) => void;
}

function FieldSelector({ availableFields, onAddFields }: FieldSelectorProps): React.JSX.Element {
    const [selectedFields, setSelectedFields] = useState<Field[]>([]);

    const handleAddFields = (): void => {
        console.log('selectedFields', selectedFields);
        onAddFields(selectedFields);
        setSelectedFields([]);
    };

    return (
        <div>
            <Autocomplete
                multiple
                options={availableFields}
                getOptionLabel={(option) => option.headerName}
                value={selectedFields}
                onChange={(event, newValue) => { setSelectedFields(newValue); }}
                renderInput={(params) => <TextField {...params} label="Добавить поля" />}
            />
            <Button variant="contained" color="primary" onClick={handleAddFields} disabled={!selectedFields.length}>
                Добавить
            </Button>
        </div>
    );
}

export default FieldSelector;
