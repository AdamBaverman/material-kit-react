import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
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
    const { control, handleSubmit, reset, setValue, getValues } = useForm<z.infer<typeof characterSchema>>({
        resolver: zodResolver(characterSchema),
        defaultValues: character || { name: '', description: '', fields: {} },
    });

    const [availableFields, setAvailableFields] = useState<Field[]>([]);

    useEffect(() => {
        const defaultFields: Record<string, string> = {};
        if (template?.fields) {
          for (const fieldName of template.fields) {
            const field = fields.find((f) => f.field === fieldName);
            if (field) {
              defaultFields[field.field] = character?.fields[field.field] || '';
            }
          }
        }
    
        reset({ ...character, fields: { ...character?.fields, ...defaultFields } });
        setAvailableFields(fields.filter((field) => !defaultFields.hasOwnProperty(field.field)));
      }, [character, template, fields, reset]);

    useEffect(() => {
        const characterFields = getValues('fields');
        const availableFieldsFetch = fields.filter((field) => !characterFields.hasOwnProperty(field.field));
        setAvailableFields(availableFieldsFetch);
    }, [fields, getValues]);

    const handleAddFields = (newFields: Field[]) => {
        const currentFields = getValues('fields');
        const updatedFields = { ...currentFields };
        for (const field of newFields) {
            updatedFields[field.field] = '';
        }
        setValue('fields', updatedFields);
        setAvailableFields((prevFields) => prevFields.filter((field) => !newFields.some((f) => f.field === field.field)));
    };

    const handleRemoveField = (fieldName: string) => {
        const currentFields = getValues('fields');
        delete currentFields[fieldName];
        setValue('fields', currentFields);
        setAvailableFields((prevFields) => [...prevFields, fields.find((f) => f.field === fieldName)!]);
    };

    const onSubmit = (data: z.infer<typeof characterSchema>) => {
        onSave(data as Character);
    };

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
                    <FieldSelector
                        availableFields={availableFields}
                        onAddFields={handleAddFields}
                    />
                    {Object.entries(getValues('fields')).map(([fieldName, value]) => {
                        const field = fields.find((f) => f.field === fieldName);
                        return (
                            <div key={fieldName}>
                                <TextField
                                    label={field?.headerName || fieldName}
                                    value={value}
                                    onChange={(e) => { setValue('fields', { ...getValues('fields'), [fieldName]: e.target.value }); }}
                                    fullWidth
                                    margin="normal"
                                />
                                <Button onClick={() => { handleRemoveField(fieldName); }}>Удалить</Button>
                            </div>
                        );
                    })}
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
