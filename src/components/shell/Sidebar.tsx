import { Button, useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Sidebar({
  pages,
  setPage,
  toggle,
  currentPage,
}: {
  pages: string[];
  setPage: (page: string) => void;
  toggle: () => void;
  currentPage: string;
}) {
  const navigate = useNavigate();
  const colorScheme = useMantineColorScheme().colorScheme;

  return (
    <>
      {pages.map((key) => (
        <Button
          m="xs"
          variant="subtle"
          key={key}
          onClick={() => {
            setPage(key);
            toggle();
            navigate(`/${key.replace(/\s+/g, "-")}`);
          }}
          style={{
            color:
              currentPage === key
                ? colorScheme === "dark"
                  ? "#806e45"
                  : "#A76652"
                : colorScheme === "dark"
                  ? "#ffda9b"
                  : "#5D0000",
          }}
        >
          {key}
        </Button>
      ))}
    </>
  );
}

export default Sidebar;

