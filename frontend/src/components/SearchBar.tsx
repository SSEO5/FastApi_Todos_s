import { useState } from "react";
import styled from "styled-components";
import { Button } from "./common";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Form onSubmit={handleSearch}>
      <Input
        type="text"
        placeholder="🔍 검색어 입력"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">검색</Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 2;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;
