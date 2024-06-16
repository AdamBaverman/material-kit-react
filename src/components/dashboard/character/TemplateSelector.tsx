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
        const templateId = parseInt(event.target.value, 10);
        const template = templates.find((t) => t.id === templateId) || null;
        setSelectedTemplate(template);
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
                {templates && templates.length > 0 ? (
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
                ) : (
                    <div>Нет доступных шаблонов</div>
                )}
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
