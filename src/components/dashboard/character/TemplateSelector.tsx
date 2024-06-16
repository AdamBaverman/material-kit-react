import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { type Template } from '@/types';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onChange: (template: Template | null) => void;
}

function TemplateSelector({ templates, selectedTemplate, onChange }: TemplateSelectorProps): React.JSX.Element {
  const handleChange: (event: React.ChangeEvent<{ value: unknown }>) => void = (event) => {
    const templateId = event.target.value as number | null;
    const template = templates.find((t) => t.id === templateId) || null;
    onChange(template);
  };

  return (
    <FormControl>
      <InputLabel>Шаблон</InputLabel>
      <Select value={selectedTemplate?.id || ''} onChange={handleChange}>
        <MenuItem value="">Пустой шаблон</MenuItem>
        {templates.map((template) => (
          <MenuItem key={template.id} value={template.id}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TemplateSelector;
