import React from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToMarkdown from "draftjs-to-markdown";

import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TextEditor = ({ postData, setPostData }) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);

    if (editorState) {
      const contentState = editorState.getCurrentContent();
      const raw = convertToRaw(contentState);

      // First pass: Convert to plain text with basic formatting
      let plainText = raw.blocks
        .map((block) => {
          // Handle different block types
          const prefix =
            block.type === "unordered-list-item"
              ? "- "
              : block.type === "ordered-list-item"
              ? "1. "
              : block.type === "header-one"
              ? "# "
              : block.type === "header-two"
              ? "## "
              : block.type === "header-three"
              ? "### "
              : "";

          // Get the text content
          let text = block.text;

          // Apply inline styles
          const inlineStyles = [];
          for (let key in block.inlineStyleRanges) {
            const range = block.inlineStyleRanges[key];
            if (range.style === "BOLD") {
              inlineStyles.push({
                start: range.offset,
                end: range.offset + range.length,
                style: "**",
              });
            } else if (range.style === "ITALIC") {
              inlineStyles.push({
                start: range.offset,
                end: range.offset + range.length,
                style: "_",
              });
            }
          }

          // Apply styles from end to start to not mess up offsets
          inlineStyles
            .sort((a, b) => b.start - a.start)
            .forEach((style) => {
              text =
                text.slice(0, style.start) +
                style.style +
                text.slice(style.start, style.end) +
                style.style +
                text.slice(style.end);
            });

          return prefix + text;
        })
        .join("\n\n");

      // Second pass: Clean up any remaining HTML or special characters
      plainText = plainText
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .replace(/&[^;]+;/g, "") // Remove HTML entities
        .replace(/\u200B/g, "") // Remove zero-width spaces
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      setPostData({
        ...postData,
        jobDescriptions: plainText,
      });
    }
  };

  return (
    <div>
      <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        editorState={editorState}
        editorStyle={{
          border: "1px solid #ECECEC",
          height: "160px",
          background: "#FBFBFB",
          padding: "10px",
        }}
        onEditorStateChange={handleEditorChange}
        toolbar={{
          options: ["inline", "blockType", "list"],
          inline: {
            options: ["bold", "italic"],
            bold: { className: "bordered-option-classname" },
            italic: { className: "bordered-option-classname" },
          },
          blockType: {
            options: ["Normal", "H1", "H2", "H3"],
          },
          list: {
            options: ["unordered", "ordered"],
            unordered: { className: "bordered-option-classname" },
            ordered: { className: "bordered-option-classname" },
          },
        }}
      />
    </div>
  );
};

export default TextEditor;
