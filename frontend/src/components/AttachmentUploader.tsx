import { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "./common";
import { Attachment } from "../types";
import {
  uploadAttachment,
  deleteAttachment,
  getAttachmentDownloadUrl,
} from "../api";

type AttachmentUploaderProps = {
  todoId: number;
  initialAttachments?: Attachment[];
  onAttachmentsChange?: (attachments: Attachment[]) => void;
};

export const AttachmentUploader = ({
  todoId,
  initialAttachments = [],
  onAttachmentsChange,
}: AttachmentUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachments, setAttachments] =
    useState<Attachment[]>(initialAttachments);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && todoId) {
      setIsUploading(true);
      try {
        const newAttachment = await uploadAttachment(todoId, selectedFile);
        const updatedAttachments = [...attachments, newAttachment];
        setAttachments(updatedAttachments);
        setSelectedFile(null); // 업로드 후 파일 선택 초기화
        alert("파일이 성공적으로 업로드되었습니다.");
        if (onAttachmentsChange) {
          onAttachmentsChange(updatedAttachments);
        }
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsUploading(false);
      }
    } else {
      alert("업로드할 파일을 선택해주세요.");
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (window.confirm("정말로 이 첨부 파일을 삭제하시겠습니까?")) {
      try {
        await deleteAttachment(todoId, attachmentId);
        const updatedAttachments = attachments.filter(
          (att) => att.id !== attachmentId
        );
        setAttachments(updatedAttachments);
        alert("첨부 파일이 삭제되었습니다.");
        if (onAttachmentsChange) {
          onAttachmentsChange(updatedAttachments);
        }
      } catch (error) {
        console.error("첨부 파일 삭제 실패:", error);
        alert("첨부 파일 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <AttachmentContainer>
      <AttachmentTitle>첨부 파일</AttachmentTitle>
      <FileUploadWrapper>
        <FileInput type="file" onChange={handleFileChange} />
        <UploadButton
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "업로드 중..." : "업로드"}
        </UploadButton>
      </FileUploadWrapper>

      {attachments.length > 0 ? (
        <AttachmentList>
          {attachments.map((attachment) => (
            <AttachmentItem key={attachment.id}>
              <span>{attachment.original_filename}</span>
              <AttachmentActions>
                <DownloadLink
                  href={getAttachmentDownloadUrl(todoId, attachment.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  다운로드
                </DownloadLink>
                <DeleteButton
                  onClick={() => handleDeleteAttachment(attachment.id)}
                >
                  삭제
                </DeleteButton>
              </AttachmentActions>
            </AttachmentItem>
          ))}
        </AttachmentList>
      ) : (
        <NoAttachmentsMessage>첨부 파일이 없습니다.</NoAttachmentsMessage>
      )}
    </AttachmentContainer>
  );
};

const AttachmentContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const AttachmentTitle = styled.h4`
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1rem;
`;

const FileUploadWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const FileInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`;

const UploadButton = styled(Button)`
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
`;

const AttachmentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AttachmentItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px dashed #e0e0e0;
  &:last-child {
    border-bottom: none;
  }
  font-size: 0.95rem;
  color: #4b5563;
`;

const AttachmentActions = styled.div`
  display: flex;
  gap: 10px;
`;

const DownloadLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover {
    background-color: #dc2626;
  }
`;

const NoAttachmentsMessage = styled.p`
  color: #6b7280;
  font-style: italic;
  font-size: 0.9rem;
`;
