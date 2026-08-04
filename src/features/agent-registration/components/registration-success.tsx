import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RegistrationSuccessProps = {
  open: boolean;
  onClose: () => void;
};

const RegistrationSuccess = ({ open, onClose }: RegistrationSuccessProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ثبت نام با موفقیت انجام شد</DialogTitle>
          <DialogDescription>
            اطلاعات نمایندگی با موفقیت ثبت شد.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button type="button" />}>بستن</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSuccess;
