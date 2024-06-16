import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FieldSelector from './FieldSelector';
import { type Character, type Field, type Template } from '@/types';

interface CharacterFormProps {
    open: boolean;
    character: Character | null;
    template: Template | null;
    fields: Field[];
    onSave: (character: Character) => void;
    onCancel: () => void;
}

const characterSchema = z.object({
    name: z.string().min(1, 'Имя обязательно'),
    description: z.string(),
    fields: z.record(z.any()),
});

function CharacterForm({ open, character, template, fields, onSave, onCancel }: CharacterFormProps): React.JSX.Element {
    const [isEditingFields, setIsEditingFields] = useState(false);
    const { control, handleSubmit, reset } = useForm<z.infer<typeof characterSchema>>({
        resolver: zodResolver(characterSchema),
        defaultValues: character || { name: '', description: '', fields: {} },
    });

    useEffect(() => {
        const defaultFields = template?.fields.reduce((acc, field) => {
            acc[field] = '';
            return acc;
        }, {});

        reset(character || { name: '', description: '', fields: defaultFields || {} });
    }, [character, template, reset]);

    const handleAddField = (field: Field) => {
        const updatedFields = { ...control._defaultValues.fields, [field.field]: '' };
        reset({ ...control._defaultValues, fields: updatedFields });
    };

    const handleRemoveField = (fieldName: string) => {
        const updatedFields = { ...control._defaultValues.fields };
        delete updatedFields[fieldName];
        reset({ ...control._defaultValues, fields: updatedFields });
    };

    const onSubmit = (data: z.infer<typeof characterSchema>) => {
        onSave(data as Character);
    };

    const characterFields = control._defaultValues.fields || {};

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{character ? 'Редактировать персонажа' : 'Создать персонажа'}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Имя" fullWidth margin="normal" />}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Описание" fullWidth margin="normal" />}
                    />
                    <FormControlLabel
                        control={<Switch checked={isEditingFields} onChange={(e) => setIsEditingFields(e.target.checked)} />}
                        label="Редактировать поля"
                    />
                    {isEditingFields ? <>
                            <FieldSelector
                                availableFields={fields.filter((field) => !characterFields.hasOwnProperty(field.field))}
                                onAddField={handleAddField}
                            />
                            {Object.entries(characterFields).map(([fieldName, value]) => (
                                <div key={fieldName}>
                                    <TextField
                                        label={fields.find((field) => field.field === fieldName)?.headerName || fieldName}
                                        value={value}
                                        onChange={(e) => reset({ ...control._defaultValues, fields: { ...characterFields, [fieldName]: e.target.value } })}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Button onClick={() => handleRemoveField(fieldName)}>Удалить</Button>
                                </div>
                            ))}
                        </> : null}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Отмена</Button>
                <Button type="submit" onClick={handleSubmit(onSubmit)} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CharacterForm;
