'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from './CardList';
import TemplateSelector from './TemplateSelector';
// import CardEditor from './CardEditor';
import CardForm from './CardForm';
import { type Character, type Template, type Field } from '@/types';

function CharacterPage(): React.JSX.Element {
    // const [characters, setCharacters] = useState([]);
    // const [templates, setTemplates] = useState([]);
    const [fields, setFields] = useState<Field[]>([]);
    // const [selectedCharacter, setSelectedCharacter] = useState(null);
    // const [selectedFields, setSelectedFields] = useState(null);
    // const [selectedTemplate, setSelectedTemplate] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const [isCreating, setIsCreating] = useState(false);
    // const [isCreatingCard, setIsCreatingCard] = useState(false);
    // 
    const [characters, setCharacters] = useState<Character[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingCard, setIsCreatingCard] = useState(false);


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const [charactersResponse, templatesResponse, fieldsResponse] = await Promise.all([
                    axios.get('/api/character'),
                    axios.get('/api/character/templates'),
                    axios.get('/api/character/columns')
                ]);

                setCharacters(charactersResponse.data);
                setFields(fieldsResponse.data);
                setTemplates(templatesResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (characterId: number): void => {
        // const character = characters.find((char) => char.cid === characterId);
        // setSelectedCharacter(character);
        // setSelectedTemplate(character.template);
        // setIsCreating(false);
    };

    const handleCreate = (): void => {
        setIsCreatingCard(true);
    };

    const handleCloseCard = (): void => {
        setIsCreatingCard(false);
    };

    const handleSaveCharacter = async (character: Character): Promise<void> => {
        try {
            if (character.cid) {
                await axios.put(`/api/characters/${String(character.cid)}`, character);
            } else {
                await axios.post('/api/characters', character);
            }

            const charactersResponse = await axios.get<Character[]>('/api/characters');
            setCharacters(charactersResponse.data);
            setIsCreatingCard(false);
        } catch (error) {
            setError('Ошибка при сохранении персонажа');
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <CardList characters={characters} onEdit={handleEdit} onCreate={handleCreate} />
            {isCreatingCard ? <CardCreator open={isCreatingCard} onClose={handleCloseCard}>
                <TemplateSelector
                    templates={templates}
                    onSelect={(template) => {
                        const newCharacter: Character = {
                            // cid: null,
                            name: '',
                            description: '',
                            fields: template?.fields || [],
                        };
                        void handleSaveCharacter(newCharacter);
                    }}
                />
            </CardCreator> : null}
            <div>
                <h2>Debug</h2>
                {/* <pre>selectedCharacter: {JSON.stringify(selectedCharacter, null, 2)} </pre>
                <pre>selectedTemplate: {JSON.stringify(selectedTemplate, null, 2)} </pre> */}
                <pre>characters: {characters.length} {JSON.stringify(characters, null, 2)}</pre>
                <pre>templates: {JSON.stringify(templates, null, 2)}</pre>
                <pre>fields: {fields.length} {JSON.stringify(fields, null, 2)}</pre>
            </div>
        </div>
    );
}

export default CharacterPage;
