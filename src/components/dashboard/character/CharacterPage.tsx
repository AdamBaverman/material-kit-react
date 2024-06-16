'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from './CardList';
import CharacterForm from './CharacterForm';
import { type Character } from '@/types';

function CharacterPage(): React.JSX.Element {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    void fetchCharacters();
  }, []);

  const fetchCharacters = async (): Promise<void> => {
    const response = await axios.get<Character[]>('/api/character');
    setCharacters(response.data);
  };

  const handleCreate = (): void => {
    setSelectedCharacter(null);
    setIsFormOpen(true);
  };

  const handleEdit = (character: Character): void => {
    setSelectedCharacter(character);
    setIsFormOpen(true);
  };

  const handleCloseForm = (): void => {
    setSelectedCharacter(null);
    setIsFormOpen(false);
  };

  const handleSaveCharacter = async (character: Character): Promise<void> => {
    try {
      if (character.cid) {
        await axios.put('/api/character', character);
      } else {
        await axios.post('/api/character', character);
      }
      await fetchCharacters();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving character:', error);
      // Обработка ошибки, например, отображение сообщения об ошибке пользователю
    }
  };

  return (
    <div>
      <CardList characters={characters} onEdit={handleEdit} onCreate={handleCreate} />
      {isFormOpen ? <CharacterForm
          character={selectedCharacter}
          onSave={handleSaveCharacter}
          onCancel={handleCloseForm}
        /> : null}
    </div>
  );
}

export default CharacterPage;
