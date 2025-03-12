import { useNavigate } from "react-router-dom";
import { Button, Modal, useMantineColorScheme } from "@mantine/core";
import { SearchResult } from "../../types";
import SearchPreview from "./SearchPreview";
import { useDisclosure } from "@mantine/hooks";
import SearchPopout from "./SearchPopout";
import { useState } from "react";

function SearchResults({ results, search, closeDropdown }: { results: SearchResult[], search: string, closeDropdown: () => void }) {
  const navigate = useNavigate();
  const [modalOpen, { open, close }] = useDisclosure(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const colorScheme = useMantineColorScheme().colorScheme;

  const handleResultClick = (result: SearchResult) => {
    setResult(result);
    open();
    closeDropdown();
  };

  const goToPage = () => {
    if (result) {
      navigate(`/${result.page}#${result.id}`);
      close();
      closeDropdown();
      setResult(null);
    }
  };

  return (
    <div id="result" className={`${useMantineColorScheme().colorScheme === 'dark' ? 'dark' : ''}`} style={{
      maxHeight: '80vh',
      overflowY: 'auto',
      margin: '8px',
    }}>
      <div className="bg-paper page d-flex flex-wrap a4">
        {results.map((result, index) => (
          <SearchPreview onClick={() => handleResultClick(result)} key={index} result={result} search={search} />
        ))}
        {results.length === 0 && (
          <div>No results found</div>
        )}
      </div>
      <Modal
        title={
          <Button
            bg={colorScheme === 'dark' ? '#ffda9b' : '#5D0000'}
            c={colorScheme === 'dark' ? '#000000' : '#ffffff'}
            onClick={goToPage}
            variant="filled"
          >
            Go To Page
          </Button>
        }
        size="xl"
        opened={modalOpen && result !== null}
        onClose={close}
      >
        {result && <SearchPopout result={result} search={search} />}
      </Modal>
    </div>
  );
}

export default SearchResults;
