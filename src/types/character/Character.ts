import { type Field } from "./Field";

export interface Character {
  cid?: number; // null при создании
  name: string;
  description: string;
  fields?: Field[];
  // Другие свойства персонажа
}
