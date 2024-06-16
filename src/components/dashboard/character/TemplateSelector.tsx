import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { type Template } from '@/types';

interface TemplateSelectorProps {
    open: boolean;
    templates: Template[];
    onSelect: (template: Template) => void;
    onCancel: () => void;
}

function TemplateSelector({ open, templates, onSelect, onCancel }: TemplateSelectorProps): React.JSX.Element {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const templateId = event.target.value;
        const template = templates.find((t) => t.id === parseInt(templateId));
        setSelectedTemplate(template || null);
    };

    const handleNext = (): void => {
        if (selectedTemplate) {
            onSelect(selectedTemplate);
        }
    };

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Выберите шаблон</DialogTitle>
            <DialogContent>
                <RadioGroup value={selectedTemplate?.id || ''} onChange={handleChange}>
                    {templates.map((template) => (
                        <FormControlLabel
                            key={template.id}
                            value={template.id}
                            control={<Radio />}
                            label={template.name}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Отмена</Button>
                <Button onClick={handleNext} disabled={!selectedTemplate}>
                    Далее
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TemplateSelector;
