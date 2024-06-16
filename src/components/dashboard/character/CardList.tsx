import React from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import { type Character } from '@/types';

interface CardListProps {
    characters: Character[];
    onEdit: (character: Character) => void;
    onCreate: () => void;
}

function CardList({ characters, onEdit, onCreate }: CardListProps): React.JSX.Element {
    return (
        <div>
            {characters.map((character) => (
                <Card key={character.cid} onClick={() => { onEdit(character); }}>
                    <CardContent>
                        <Typography variant="h5">{character.name}</Typography>
                        <Typography variant="subtitle1">cid: {character.cid}</Typography>
                        <Typography variant="subtitle1">description: {character.description}</Typography>
                        <Typography variant="subtitle1">fields: {character.fields?.length||0}</Typography>
                        {/* <Typography variant="body1">Поля: {character.fields?.map((field) => field.headerName).join(', ')||'Not found'}</Typography> */}
                    </CardContent>
                </Card>
            ))}
            <Button variant="contained" color="primary" onClick={onCreate}>
                Создать
            </Button>
        </div>
    );
}

export default CardList;
