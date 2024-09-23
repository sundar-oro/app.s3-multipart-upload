import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";
import { Loader2 } from "lucide-react";

const DeleteDialog = ({
  openOrNot,
  label,
  onCancelClick,
  onOKClick,
  deleteLoading,
}: {
  openOrNot: boolean;
  label: string;
  onCancelClick: () => void;
  onOKClick: () => void;
  deleteLoading: boolean;
}) => {
  return (
    <AlertDialog open={openOrNot}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{label}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelClick}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white"
            onClick={onOKClick}
          >
            {deleteLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Yes! Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
