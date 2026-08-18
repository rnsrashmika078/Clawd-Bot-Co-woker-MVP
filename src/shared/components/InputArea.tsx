"use client";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { IoIosAttach } from "react-icons/io";
import { useSelector } from "react-redux";
import { MdStop } from "react-icons/md";
import { File, FormField, Status } from "@/features/chat/types/chat.types";
import { uploadImage } from "@/features/chat/services/fileUpload";
import Loader from "@/shared/components/Loader";
import ImageSkeleton from "./Skeletons";
import Preview from "@/shared/components/ImagePreview";
import { StoreState } from "@/redux/store";
import { LocalUploadImage } from "@/features/chat/services/localFileUpload";

interface InputAreaProps {
  onSubmit: (data: FormField) => void;
  file: File | null;
  status: Status;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  isLoading: boolean;
  // stream function
  stop: () => void;
}
export const InputArea = ({
  file,
  onSubmit,
  status,
  setFile,
  isLoading,
  stop,
}: InputAreaProps) => {
  const user = useSelector((store: StoreState) => store.auth.user);
  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleFileUpload = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.click();
  }, []);

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    setLoading(true);
    const imageData = await LocalUploadImage(rawFile);
    console.log("IMAGE DATA", ImageData);

    // const imageData = await uploadImage(rawFile, user?.id);
    setLoading(false);
    setFile({ url: imageData?.secure_url, format: imageData?.format });
  };

  const [input, setInput] = useState<string>("");

  return (
    <div className="sticky  bottom-0 px-5">
      <FieldGroup className="w-full">
        <Loader loading={isLoading} />
        <Field className="bg-input rounded-md">
          <InputGroup className="border border-border">
            <InputGroupTextarea
              onChange={(e) => setInput(e.target.value)}
              id="block-end-textarea"
              disabled={false}
              className="min-h-10 h-10 max-h-42 "
              placeholder="Write a comment..."
            />
            <InputGroupAddon align="block-end">
              {/* Attachment */}
              <InputGroupButton
                variant="default"
                size="sm"
                className=""
                type="button"
                disabled={false}
                onClick={handleFileUpload}
              >
                <IoIosAttach />
              </InputGroupButton>
              <input
                type="file"
                onChange={handleOnChange}
                className="hidden"
                ref={inputRef}
              />
              {/* Send */}
              <InputGroupButton
                disabled={!input}
                variant="default"
                size="sm"
                className="ml-auto"
                onClick={() => onSubmit({ input })}
              >
                {status === "loading" ? (
                  <MdStop onClick={stop} />
                ) : (
                  <IoMdSend />
                )}
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon align="block-start">
              {loading ? <ImageSkeleton /> : <Preview file={file} />}
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </div>
  );
};
