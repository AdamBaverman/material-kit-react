import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import FieldSelector from './FieldSelector';
import TemplateSelector from './TemplateSelector';
import { type Character, type Field, type Template } from '@/types';

interface CharacterFormProps {
  character: Character | null;
  fields: Field[];
  onSave: (character: Character) => void;
  onCancel: () => void;
}

function CharacterForm({ character, fields, onSave, onCancel }: CharacterFormProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

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
    <form onSubmit={handleSubmit}>
      <TextField label="Имя" value={name} onChange={(e) => { setName(e.target.value); }} />
      <TextField label="Описание" value={description} onChange={(e) => { setDescription(e.target.value); }} />
      <TemplateSelector
        templates={[]} // Передайте доступные шаблоны
        selectedTemplate={selectedTemplate}
        onChange={setSelectedTemplate}
      />
      <FieldSelector
        fields={fields}
        selectedFields={selectedFields}
        onChange={setSelectedFields}
      />
      <Button type="submit">Сохранить</Button>
      <Button onClick={onCancel}>Отмена</Button>
    </form>
  );
}

export default CharacterForm;
