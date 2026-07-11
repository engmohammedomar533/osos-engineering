import React from 'react';
import CanonicalLink from './CanonicalLink';

const PageWrapper = ({ children }) => {
  return (
    <>
      <CanonicalLink />
      {children}
    </>
  );
};

export default PageWrapper;
