import { Input, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { ParsedElement, SearchResult } from "../../types";
import { useEffect, useState, useRef } from "react";
import SearchResults from "./SearchResults";

const searchCache: Record<string, SearchResult[]> = {};
const searchCacheTime: Record<string, number> = {};
const searchCacheDuration = 1000 * 60 * 5; // 5 minutes

function createLowercaseCache(parsedElement: ParsedElement) {
  if (parsedElement.type === 'table') {
    parsedElement.lowercaseData = parsedElement.data.map(row => row.map(cell => cell.toLowerCase()));
    parsedElement.columns = parsedElement.columns.map(column => ({ ...column, lowercaseContent: column.content.toLowerCase() }));
  } else if (parsedElement.type === 'heading') {
    parsedElement.lowercaseHeading = parsedElement.heading.toLowerCase();
    parsedElement.content.forEach(element => createLowercaseCache(element));
  } else if (parsedElement.type === 'item') {
    parsedElement.lowercaseHeading = parsedElement.heading.toLowerCase();
    parsedElement.lowercaseSubheading = parsedElement.subheading.toLowerCase();
    parsedElement.content.forEach(element => createLowercaseCache(element));
  } else if (parsedElement.type === 'paragraph') {
    parsedElement.lowercaseContent = parsedElement.content.toLowerCase();
  } else if (parsedElement.type === 'list') {
    parsedElement.lowercaseContent = parsedElement.content.map(item => item.toLowerCase());
  } else if (parsedElement.type === 'traits') {
    parsedElement.lowercaseContent = parsedElement.content.map(item => item.toLowerCase());
  }
}

// Example condition functions
const conditionFunctions: Record<string, (search: string, element: ParsedElement) => boolean> = {
  table: (search, element) => (
    element.type === 'table' && (
      element.lowercaseData!.some(row => row.some(cell => cell.includes(search))) ||
      element.columns.some(column => column.lowercaseContent!.includes(search))
    )
  ),
  heading: (search, element) => (
    element.type === 'heading' &&
    element.lowercaseHeading!.includes(search)
  ),
  item: (search, element) => (
    element.type === 'item' &&
    (
      element.lowercaseHeading!.includes(search) ||
      element.lowercaseSubheading!.includes(search)
    )
  ),
  paragraph: (search, element) => (
    element.type === 'paragraph' &&
    element.lowercaseContent!.includes(search)
  ),
  list: (search, element) => (
    element.type === 'list' &&
    element.lowercaseContent!.some(item => item.includes(search))
  ),
  traits: (search, element) => (
    element.type === 'traits' &&
    element.lowercaseContent!.some(item => item.includes(search))
  ),
};

function traverseRuleset(ruleset: ParsedElement[], search: string, page: string, parentId?: string, parentElement?: ParsedElement): SearchResult[] {
  const results: SearchResult[] = [];

  for (const element of ruleset) {
    // Determine the current element's ID
    const currentId = 'id' in element && element.id ? element.id : parentId;
    const lastElementWithId = 'id' in element && element.id ? element : parentElement;

    // Check if the element meets the condition for its type
    const conditionFunction = conditionFunctions[element.type];
    if (conditionFunction && conditionFunction(search, element)) {
      // Add the element to the results with the inherited ID
      results.push({ page, id: currentId || '', type: element.type, element, lastElementWithId });
    }

    // Recursively process child elements
    if ('content' in element && Array.isArray(element.content)) {
      if (!Array.isArray(element.content) || !element.content.every(el => typeof el === 'object')) {
        continue;
      }
      results.push(...traverseRuleset(element.content, search, page, currentId, lastElementWithId));
    }
  }

  return results;
}

function Search({ flex, rulesets, setDocumentSearch }: { flex: number, rulesets: Record<string, ParsedElement[]>, setDocumentSearch: (search: string) => void }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const theme = useMantineTheme();
  const colorScheme = useMantineColorScheme().colorScheme;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    for (const ruleset of Object.values(rulesets)) {
      ruleset.forEach(element => createLowercaseCache(element));
    }
  }, [rulesets]);

  useEffect(() => {
    const interval = setInterval(() => {
      for (const search of Object.keys(searchCache)) {
        if (searchCacheTime[search] + searchCacheDuration < Date.now()) {
          delete searchCache[search];
        }
      }
    }, searchCacheDuration);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (search.length > 3) {
      setDropdownOpen(true);
      if (searchCache[search]) {
        setResults(searchCache[search]);
      } else {
        const res: SearchResult[] = [];
        for (const [page, ruleset] of Object.entries(rulesets)) {
          const filteredElements = traverseRuleset(ruleset, search.toLowerCase(), page.replace(/\s+/g, '-'),);
          res.push(...filteredElements);
        }
        setResults(res);
        searchCache[search] = res;
        searchCacheTime[search] = Date.now();
      }
      console.log(results);
    } else {
      setResults([]);
    }
  }, [search, rulesets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        dropdownRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setDocumentSearch(event.target.value);
  };

  return (
    <div style={{ position: 'relative', flex: flex }}>
      <Input
        ref={inputRef}
        size="xs"
        mt={5}
        placeholder="Search"
        h="100%"
        value={search}
        onChange={handleSearch}
        onFocus={() => search.length > 3 && setDropdownOpen(true)}
      />
      <div
        ref={dropdownRef}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: dropdownOpen ? 'block' : 'none',
          borderRadius: 4,
        }}
      >
        <SearchResults results={results} search={search} closeDropdown={() => setDropdownOpen(false)} />
      </div>
    </div>
  );
}

export default Search;
