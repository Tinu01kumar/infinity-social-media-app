import React from 'react';
import styled from 'styled-components';

// Styled component for the NotFound page
const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <div>Page Not Found</div>
    </NotFoundContainer>
  );
}

export default NotFound;
