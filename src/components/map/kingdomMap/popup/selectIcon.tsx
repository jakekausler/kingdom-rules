import React, { useEffect, useState } from 'react';
import {
  Menu,
  Button,
  ScrollArea,
  Grid,
  Image,
  Box,
  Center,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface SelectIconProps {
  iconUrls: string[];
  onChange: (url: string) => void;
  value?: string;
  iconSize?: number;
  width?: number;
  label?: string;
}

export const SelectIcon: React.FC<SelectIconProps> = ({
  iconUrls,
  onChange,
  value = '',
  iconSize = 30,
  width = 240,
  label = undefined,
}) => {
  const [selected, setSelected] = useState(value);

  const handleSelect = (url: string) => {
    setSelected(url);
    onChange(url);
  };

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <Stack>
      {label && <Text>{label}</Text>}
      <Menu
        shadow="md"
        width={width}
        withinPortal
        closeOnItemClick={false}
        position="bottom-start"
      >
        <Menu.Target>
          <Button variant="outline" rightSection={<IconChevronDown size={16} />} >
            {selected ? (
              <Image src={selected} width={30} height={30} radius="sm" />
            ) : (
              'Select Icon'
            )}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <ScrollArea h={200}>
            <Grid gutter="xs">
              {iconUrls.map((url) => (
                <Grid.Col span={0} key={url}>
                  <Box
                    p={0}
                    style={(theme) => ({
                      border:
                        selected === url
                          ? `1px solid ${theme.colors.blue[6]}`
                          : '1px solid transparent',
                      borderRadius: theme.radius.sm,
                      cursor: 'pointer',
                      transition: 'border 0.2s',
                      '&:hover': {
                        borderColor: theme.colors.gray[4],
                      },
                    })}
                    onClick={() => handleSelect(url)}
                  >
                    <Center>
                      <Image src={url} width={iconSize} height={iconSize} fit="contain" />
                    </Center>
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
          </ScrollArea>
        </Menu.Dropdown>
      </Menu>
    </Stack>
  );
};
