import { ActionIcon, Burger, Group, Title, useMantineColorScheme } from "@mantine/core";
import Search from "../search/Search";
import { IconMoonStars } from "@tabler/icons-react";
import { IconSun } from "@tabler/icons-react";
import { ParsedElement } from "../../types";

function Header({ opened, toggle, rulesets, setDocumentSearch }: { opened: boolean; toggle: () => void, rulesets: Record<string, ParsedElement[]>, setDocumentSearch: (search: string) => void }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleToggleColorScheme = () => {
    toggleColorScheme();
    // Save the new color scheme to localStorage
    localStorage.setItem('colorScheme', colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Group w="100%" px="xs" h="100%">
      <Burger hiddenFrom="sm" opened={opened} onClick={toggle} />
      <Title size="md" order={1} style={{ margin: 'auto 0' }}>
        Kingdom Rules
      </Title>
      <Search flex={1} rulesets={rulesets} setDocumentSearch={setDocumentSearch} />
      <ActionIcon
        variant="subtle"
        onClick={handleToggleColorScheme}
        title="Toggle color scheme"
      >
        {colorScheme === 'dark' ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
      </ActionIcon>
    </Group>
  );
}

export default Header;
