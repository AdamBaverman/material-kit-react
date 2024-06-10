import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
    activate: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    disagreeText?: string;
    agreeText?: string;
}

export function AlertDialog({
    activate,
    onClose,
    onConfirm,
    title,
    content,
    disagreeText,
    agreeText,
}: AlertDialogProps): React.JSX.Element {
    return (
        <Dialog
            open={activate}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{disagreeText||'No'}</Button>
                <Button onClick={onConfirm}>
                    {agreeText||'Yes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
