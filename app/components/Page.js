import React, { useEffect} from 'react';

import { Container } from './Container';

export const Page = ({children, title, wide}) => {
  useEffect(() => {
    document.title = `Social App | ${title}`;
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container wide={wide}>
      {children}
    </Container>
  );
}