import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FieldSelector from './FieldSelector';
import { type Character, type Field } from '@/types';

interface CharacterFormProps {
    open: boolean;
    character: Character | null;
    fields: Field[];
    onSave: (character: Character) => void;
    onCancel: () => void;
}

function CharacterForm({ open, character, fields, onSave, onCancel }: CharacterFormProps): React.JSX.Element {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFields, setSelectedFields] = useState<Field[]>([]);

    useEffect(() => {
        if (character) {
            setName(character.name);
            setDescription(character.description);
            setSelectedFields(character.fields || []);
        } else {
            setName('');
            setDescription('');
            setSelectedFields([]);
        }
    }, [character]);

    const handleAddFields = (newFields: Field[]): void => {
        const uniqueFields = newFields.filter((field) => !selectedFields.some((f) => f.field === field.field));
        setSelectedFields([...selectedFields, ...uniqueFields]);
    };

    const handleRemoveField = (field: Field): void => {
        setSelectedFields(selectedFields.filter((f) => f.field !== field.field));
    };

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        const updatedCharacter: Character = {
            cid: character?.cid ?? undefined,
            name,
            description,
            fields: selectedFields,
        };
        onSave(updatedCharacter);
    };

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{character ? 'Редактировать персонажа' : 'Создать персонажа'}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField label="Имя" value={name} onChange={(e) => { setName(e.target.value); }} fullWidth margin="normal" />
                    <TextField label="Описание" value={description} onChange={(e) => { setDescription(e.target.value); }} fullWidth margin="normal" />
                    <FieldSelector
                        availableFields={fields}
                        selectedFields={selectedFields}
                        onAddFields={handleAddFields}
                        onRemoveField={handleRemoveField}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Отмена</Button>
                <Button type="submit" onClick={handleSubmit} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
            <pre>selectedFields:{JSON.stringify(selectedFields, null, 2)}</pre>
        </Dialog>
    );
}

export default CharacterForm;
