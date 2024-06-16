import { type Field } from "./Field";

export interface Template {
    id: number;
    name: string;
    fields: Field[];
}