'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from './CardList';
import CharacterForm from './CharacterForm';
import TemplateSelector from './TemplateSelector';
import { type Character, type Template, type Field } from '@/types';

function CharacterPage(): React.JSX.Element {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [templates, setTemplates] = useState<Template[]>([
        { id: -1, name: 'По умолчанию', fields: [] },
    ]);
    const [fields, setFields] = useState<Field[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
    const [isCharacterFormOpen, setIsCharacterFormOpen] = useState(false);


    useEffect(() => {
        void fetchCharacters();
        void fetchTemplates();
        void fetchFields();
    }, []);
    
    const fetchCharacters = async (): Promise<void> => {
        const response = await axios.get<Character[]>('/api/character');
        setCharacters(response.data);
    };
    
    const fetchTemplates = async (): Promise<void> => {
        const response = await axios.get<Template[]>('/api/character/templates');
        const templatesWithFields = response.data.map((template) => ({
          ...template,
      fields: fields.filter((iField) => template.fields.includes(iField)), //iField.name ?
        }));
        setTemplates([...templates, ...templatesWithFields]);
      };
    
    const fetchFields = async (): Promise<void> => {
        const response = await axios.get<Field[]>('/api/character/columns');
        setFields(response.data);
    };

    const handleCreate = (): void => {
        setSelectedCharacter(null);
        setSelectedTemplate(null);
        setIsTemplateSelectorOpen(true);
    };

    const handleSelectTemplate = (template: Template): void => {
        setSelectedTemplate(template);
        setIsTemplateSelectorOpen(false);
        setIsCharacterFormOpen(true);
    };

    const handleCloseTemplateSelector = (): void => {
        setIsTemplateSelectorOpen(false);
    };

    const handleCloseCharacterForm = (): void => {
        setIsCharacterFormOpen(false);
    };

    const handleEdit = (character: Character): void => {
        setSelectedCharacter(character);
        setIsCharacterFormOpen(true);
    };

    const handleSaveCharacter = async (character: Character): Promise<void> => {
        if (character.cid) {
            await axios.put('/api/character', character);
        } else {
            await axios.post('/api/character', character);
        }
        await fetchCharacters();
        handleCloseCharacterForm();
    };

    return (
        <div>
            <CardList
                characters={characters}
                onEdit={handleEdit}
                onCreate={handleCreate}
            />
            <TemplateSelector
                open={isTemplateSelectorOpen}
                templates={templates}
                onSelect={handleSelectTemplate}
                onCancel={handleCloseTemplateSelector}
            />
            <CharacterForm
                open={isCharacterFormOpen}
                character={selectedCharacter}
                fields={fields}
                onSave={handleSaveCharacter}
                onCancel={handleCloseCharacterForm}
            />
            <div>
                {/* Debug Data */}
                <pre>isTemplateSelectorOpen: {isTemplateSelectorOpen}</pre>
                <pre>isCharacterFormOpen: {isCharacterFormOpen}</pre>
                <pre>selectedCharacter: {JSON.stringify(selectedCharacter, null, 2)}</pre>
                <pre>selectedTemplate: {JSON.stringify(selectedTemplate, null, 2)}</pre>
                <pre>characters: {characters.length} {JSON.stringify(characters, null, 2)}</pre>
                <pre>templates: {templates.length} {JSON.stringify(templates, null, 2)}</pre>
                <pre>fields: {fields.length} {JSON.stringify(fields, null, 2)}</pre>
            </div>
        </div>
    );
}

export default CharacterPage;