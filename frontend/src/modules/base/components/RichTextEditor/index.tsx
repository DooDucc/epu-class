import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./QuillDarkTheme.css";
import { useTheme } from "@mui/material/styles";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  isModifyHeight?: boolean;
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  isOverlapEnter?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  isModifyHeight = false,
  onKeyPress,
  isOverlapEnter = true,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
  ];

  return (
    <div
      onKeyDownCapture={
        isOverlapEnter
          ? (e) => {
              if (e.code === "Enter") {
                e.preventDefault();
                onKeyPress?.(e);
              }
            }
          : undefined
      }
    >
      <ReactQuill
        className={
          isDarkMode ? "dark-theme" : isModifyHeight ? "editor-height" : ""
        }
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

export default RichTextEditor;
