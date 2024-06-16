import { type Character } from "./character/Character";
import { type Field } from "./character/Field";
import { type Template } from "./character/Template";

export type {Character};
export type {Field};
export type {Template};

// Пример стейта
export interface CharacterState {
    characters: Character[];
    templates: Template[];
    fields: Field[];
    selectedCharacter: Character;
    selectedTemplate: Template;
    selectedFields: Field[];
    loading: boolean;
    error: string;
    isCreating: boolean;
}

