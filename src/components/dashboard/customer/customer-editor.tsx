import React, { useState, useCallback } from 'react';
import { createOrderedMap, createStore, type JsonSchema, type onChangeHandler, storeUpdater, UIStoreProvider } from '@ui-schema/ui-schema';
import { OrderedMap } from 'immutable';
import { GridContainer } from '@ui-schema/ds-material/GridContainer';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Typography } from '@mui/material';
import { type Customer } from './customers-table';

const initialSchema = createOrderedMap({
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
} as JsonSchema);

const availableFields = {
  email: { type: 'string' },
  address: {
    type: 'object',
    properties: {
      city: { type: 'string' },
      state: { type: 'string' },
      country: { type: 'string' },
      street: { type: 'string' },
    },
  },
  phone: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
};

interface CustomerEditorProps {
  open: boolean;
  customer?: Customer;
  isEditing: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

function CustomerEditor({ open, customer, isEditing, onClose, onSave }: CustomerEditorProps): React.JSX.Element {
  const [currentCustomer, setCurrentCustomer] = useState(customer || {
    id: '',
    name: '',
    description: '',
  });
  const [schema, setSchema] = useState(initialSchema);
  const [store, setStore] = useState(() => createStore(OrderedMap({} as Record<string, any>)));
  const [selectedField, setSelectedField] = useState('');

  const onChange: onChangeHandler = useCallback(
    (actions) => {
      setStore(storeUpdater(actions));
    },
    [setStore]
  );

  const handleSchemaChange = (newSchema: JsonSchema): void => {
    setSchema(createOrderedMap(newSchema));
    setCurrentCustomer((prevCustomer) => ({
      ...prevCustomer,
      ...newSchema.properties,
    }));
  };

  const handleAddField = (): void => {
    if (selectedField && availableFields.hasOwnProperty(selectedField)) {
      handleSchemaChange({
        ...schema.toJS(),
        properties: {
          ...schema.get('properties').toJS(),
          [selectedField]: availableFields[selectedField],
        },
      });
      setSelectedField('');
    }
  };

  const handleRemoveField = (field: string): void => {
    handleSchemaChange({
      ...schema.toJS(),
      properties: Object.entries(schema.get('properties').toJS())
        .filter(([key]) => key !== field)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    });
  };

  const isEdited = (): boolean => {
    return JSON.stringify(currentCustomer) !== JSON.stringify(customer);
  };

  const handleSave = (): void => {
    onSave(currentCustomer);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Редактирование' : 'Создание'}</DialogTitle>
      <DialogContent>
        <UIStoreProvider store={store} onChange={onChange} showValidity>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Добавить поле</Typography>
            <Stack direction="row" spacing={2}>
              <Select value={selectedField} onChange={(e) => setSelectedField(e.target.value as string)} displayEmpty>
                <MenuItem value="" disabled>
                  Выберите поле
                </MenuItem>
                {Object.keys(availableFields).map((field) => (
                  <MenuItem key={field} value={field}>
                    {field}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={handleAddField}>
                Добавить
              </Button>
            </Stack>
          </Box>
          <GridContainer schema={schema} showValidity isRoot />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Удалить поле</Typography>
            <Stack direction="row" spacing={2}>
              {schema.get('properties') &&
                Object.keys(schema.get('properties').toJS()).map(
                  (field) =>
                    field !== 'name' &&
                    field !== 'description' && (
                      <Button key={field} variant="outlined" color="error" onClick={() => handleRemoveField(field)}>
                        {field}
                      </Button>
                    )
                )}
            </Stack>
          </Box>
        </UIStoreProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button disabled={!isEdited()} onClick={handleSave}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerEditor;
