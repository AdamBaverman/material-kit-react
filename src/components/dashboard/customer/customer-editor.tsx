import React, { useState } from 'react';
import { createOrderedMap, createStore, type JsonSchema, UIStoreProvider } from '@ui-schema/ui-schema';
import { UIStoreUpdaterData, UIStoreAction, UIStoreActionScoped } from '@ui-schema/ui-schema/UIStoreActions'
import { OrderedMap } from 'immutable';
import { GridContainer } from '@ui-schema/ds-material/GridContainer';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Typography, TextField } from '@mui/material';
import { type Customer } from './customers-table';
import { AlertDialog } from '@/components/dashboard/utils/AlertDialog';

// =============== EXAMPLES ===============
// const baseAction: UIStoreAction & UIStoreActionScoped = {
//     type: 'some-custom-action',
//     // optional `effect` to do something else after internal data change,
//     // but before the actual store-set/next render
//     effect: (newData: UIStoreUpdaterData, newStore: UIStoreType): void => {
//     }
// }

// const Editor = () => {
//     const [showValidity, setShowValidity] = React.useState(false)
//     const [store, setStore] = React.useState(() => createStore(createOrderedMap(data1)))
//     const [schema, setSchema] = React.useState(() => createOrderedMap(schema1))

//     const onChange = React.useCallback((actions) => {
//         setStore(storeUpdater(actions))
//     }, [setStore])

//     return <UIStoreProvider
//         store={store}
//         onChange={onChange}
//         showValidity={showValidity}
//     >
//         <UIRootRenderer schema={schema}/>
//     </UIStoreProvider>
// }
// ============== END EXAMPLES ====================

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
    customer?: Customer;
    setCustomers: (customer: Customer) => void;

    isEditing: boolean;
    isEdited: boolean;
    onClose: () => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCancel: () => void;
    open: boolean;
}

export function useOpenEditor(): boolean {
  const [open, setOpen] = useState(false); // нужно вынести в src\hooks\ и сделать по аналогии с use-popover.ts
  return open;
}


function CustomerEditor({
    customer,

}: CustomerEditorProps): React.JSX.Element {
    const [schema, setSchema] = useState(initialSchema);
    const [store, setStore] = useState(() => createStore(OrderedMap({} as Record<string, any>)));
    const [selectedField, setSelectedField] = useState('');
    const [isEditingFields, setIsEditingFields] = useState(false);
    // real card-editor
    // const [open, setOpen] = useState(false);
    const open = useOpenEditor();
    const [isEditing, setIsEditing] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [initialCustomer, setInitialCustomer] = useState<Customer | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);

    const handleSchemaChange = (newSchema: JsonSchema): void => {
        setSchema(createOrderedMap(newSchema));
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

    //   ============== CUSTOMER CARD ====================
    // TODO: решить что делать с Customer интерфейсом
    // обчистить все методы до локальных.
    const handleOpen = (customer?: Customer): void => {
        if (customer) {
            setCurrentCustomer(customer);
            setInitialCustomer(customer);
        } else {
            const newCustomer = {
                id: '',
                // avatar: '',
                name: '',
                description: '',
                // email: '',
                // address: {
                //   city: '',
                //   state: '',
                //   country: '',
                //   street: ''
                // },
                // phone: ''
            };
            setCurrentCustomer(newCustomer);
            setInitialCustomer(newCustomer);
        }
        setIsEditing(Boolean(customer));
        setOpen(true);
    };

    const isEdited = (): boolean => {
        // console.log('isEdited', {currentCustomer, initialCustomer});
        return JSON.stringify(currentCustomer) !== JSON.stringify(initialCustomer);
    };

    const handleAlert = (): void => {
        if (isEdited()) {
            setAlertOpen(true);
        } else {
            handleClose();
        }
    };

    const handleAlertClose = (): void => {
        setAlertOpen(false);
    };

    const handleAlertConfirm = (): void => {
        setAlertOpen(false);
        void handleSave();
    };

    const handleClose = (): void => {
        setOpen(false);
        setAlertOpen(false);
    };

    /**
     * Handles changes to the current customer's data.
     *
     * This function is called whenever the user updates a field in the customer form. It updates the `currentCustomer` state with the new value from the input event.
     *
     * If the input field is a nested property (e.g. `address.city`), the function updates the corresponding nested property in the `currentCustomer` object. Otherwise, it updates the top-level property.
     *
     * @param event - The React change event object containing the updated field name and value.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setCurrentCustomer((prev) => {
            if (!prev) return null;
            const [mainKey, subKey] = name.split('.');
            if (subKey) {
                return { ...prev, [mainKey]: { ...prev[mainKey], [subKey]: value } };
            }
            return { ...prev, [name]: value };
        });
    };

    /**
     * Saves the current customer data to the server.
     *
     * This function is responsible for handling the save operation for the current customer. It first checks if the customer data has been edited, and if so, it validates the required fields (name and phone). If the validation passes, it sends the updated customer data to the server using a fetch request. Depending on whether the customer is being edited or created, it uses the appropriate HTTP method (PUT or POST).
     *
     * If the save operation is successful, the function updates the customers list in the state, either by updating the existing customer or adding a new one. If there is an error, it logs the error to the console.
     *
     * @returns {Promise<void>} A Promise that resolves when the save operation is complete.
     */
    const handleSave = async (): Promise<void> => {
        if (!currentCustomer) return;

        // changes?
        if (!isEdited()) {
            console.error('All fields aren\'t changed');
            return;
        }

        // validate
        const { name, description } = currentCustomer;
        if (!name.trim() || !description.trim()) {
            console.error('All fields are required'); //TODO add error message (red field border)
            return;
        }

        const payload = {
            ...currentCustomer,
            id: currentCustomer.id || undefined,
        };

        try {
            const response = await fetch('/api/customers', {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const savedCustomer = await response.json();
                setCustomers((prev) =>
                    isEditing
                        ? prev.map((c: Customer) => (c.id === savedCustomer.id ? savedCustomer : c))
                        : [...prev, savedCustomer as Customer]
                );
                handleClose();
            } else {
                const errorData = await response.json();
                console.error('Failed to save customer:', errorData);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    //

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isEditing ? 'Редактирование' : 'Создание'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Имя"
                    name="name"
                    fullWidth
                    value={customer?.name || ''}
                    onChange={onChange}
                />
                <TextField
                    margin="dense"
                    label="Описание"
                    name="description"
                    fullWidth
                    value={customer?.description || ''}
                    onChange={onChange}
                />
                <Button variant="outlined" onClick={() => setIsEditingFields(!isEditingFields)}>
                    {isEditingFields ? 'Закрыть редактор полей' : 'Редактировать поля'}
                </Button>
                {isEditingFields ? <UIStoreProvider store={store} onChange={setStore} showValidity>
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
                    </UIStoreProvider> : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Отмена</Button>
                <Button disabled={!isEdited} onClick={() => onSave(customer!)}>
                    Сохранить
                </Button>
            </DialogActions>
            <AlertDialog activate={alertOpen}
                onClose={handleAlertClose}
                onConfirm={handleAlertConfirm}
                title="Продолжить редактирование?"
                content="У вас есть несохраненные изменения. Вы хотите продолжить?"
                agreeText="Сохранить и выйти"
                disagreeText="Вернуться"
            />
        </Dialog>

    );
}

export default CustomerEditor;
