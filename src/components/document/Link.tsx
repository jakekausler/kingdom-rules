function Link({ anchor, children }: { anchor: string, children?: React.ReactNode }) {
  return (
    <a href={anchor} style={{ cursor: 'pointer' }} className="link">
      {children}
    </a>
  );
}

export default Link; 