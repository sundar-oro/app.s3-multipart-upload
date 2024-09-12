import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DialogDemo = ({
  openOrNot,
  title,
  onCancelClick,
  onOKClick,
  deleteLoading,
}: {
  openOrNot: boolean;
  title: string;
  onCancelClick: () => void;
  onOKClick: () => void;
  deleteLoading: boolean;
}) => {
  return (
    <Dialog open={openOrNot}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Rename
            </Label>
            <Input
              id="name"
              className="col-span-3"
              placeholder="Enter the Name for category"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" type="submit">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DialogDemo;
