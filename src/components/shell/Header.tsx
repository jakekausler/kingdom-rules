import { Burger, Group, Title } from "@mantine/core";
import Search from "../search/Search";

function Header({ opened, toggle }: { opened: boolean; toggle: () => void }) {
  return (
    <Group w="100%" px="xs" h="100%">
      <Burger hiddenFrom="sm" opened={opened} onClick={toggle} />
      <Title size="md" order={1} style={{ margin: 'auto 0' }}>
        Kingdom Rules
      </Title>
      <Search flex={1} />
    </Group>
  );
}

export default Header;
