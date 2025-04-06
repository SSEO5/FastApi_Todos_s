import styled from "styled-components";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

export const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className,
}: ButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #306bc9;
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;
