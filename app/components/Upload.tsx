import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { FC } from "react";
import { Input } from "./ui/input";
import { Spinner } from ".";
import { Button } from "./ui/button";
import { isNoFileError, isWrongFileError } from "~/lib/types";

type UploadAlertProps = {
  actionData: string | number;
};

export const UploadAlert: FC<UploadAlertProps> = ({ actionData }) => {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="max-w-96 rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {actionData === "ok" ? "Yeay!" : "Oops!"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {actionData === "ok" && `Your résumé was uploaded successfully.`}
            {isNoFileError(actionData) && "No file was selected."}
            {isWrongFileError(actionData) &&
              "File provided was not a PDF file."}
            {actionData === 500 && "Internal server error. Please try again."}
            {actionData === 503 &&
              "Service is temporarily unavailable. Please try again later."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type UploadInputProps = {
  isSubmitting: boolean;
};

export const UploadInput: FC<UploadInputProps> = ({ isSubmitting }) => {
  return (
    <>
      <Input type="file" name="file" className="border-none" />
      <Button
        type="submit"
        className="rounded-l-none"
        variant={"ghost"}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner className="h-1.5 w-1.5" /> : <>Upload</>}
      </Button>
    </>
  );
};
