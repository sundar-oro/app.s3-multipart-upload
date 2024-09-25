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
import { Loader2 } from "lucide-react";

const AddDialog = ({
  openOrNot,
  title,
  onCancelClick,
  onOKClick,
  createLoading,
  placeholder,
  handleTextFieldChange,
  value,
  errMessage,
  buttonName,
}: {
  openOrNot: boolean;
  title: string;
  onCancelClick: () => void;
  onOKClick: () => void;
  createLoading: boolean;
  placeholder: string;
  handleTextFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  errMessage: string;
  buttonName: string;
}) => {
  return (
    <Dialog open={openOrNot} onOpenChange={onCancelClick}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            name="name"
            value={value}
            className="col-span-3 capitalize"
            placeholder={placeholder}
            onChange={handleTextFieldChange}
          />
          <span>
            {errMessage && <p className="text-red-500">{errMessage}</p>}
          </span>
        </div>
        <DialogFooter>
          <Button onClick={onCancelClick} variant="ghost" type="submit">
            Cancel
          </Button>
          <Button onClick={onOKClick} type="submit">
            {createLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              buttonName
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddDialog;
