import { t as localizeSystemText } from '@/utils/i18n';
// components/CrudDeleteModal.tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@/utils/helpers';

interface CrudDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    entityName?: string;
    itemType?: string;
}

export function CrudDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    entityName,
    itemType,
}: CrudDeleteModalProps) {
    const { t } = useTranslation();
    const entity = entityName || itemType || 'item';
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("Delete")} {capitalize(entity)}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t("Are you sure you want to delete")} {itemName || localizeSystemText("this {{entity}}", { entity })}? {t("This action cannot be undone.")}
                </DialogDescription>
                <DialogFooter className="sm:justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {t("Cancel")}
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm}>
                        {t("Delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
