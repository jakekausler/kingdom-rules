import { Input } from "@mantine/core";

function Search({ flex }: { flex: number }) {
  return <Input size="xs" mt={5} placeholder="Search" h="100%" style={{ flex: flex }} />;
}

export default Search;
