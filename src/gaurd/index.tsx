import React, { ReactNode } from 'react';

interface ProtectedProps {
   Cmp: React.ComponentType<React.ComponentProps<any>>;
   children?: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ Cmp, children }) => {
   return (
      <>
         <Cmp>{children}</Cmp>
      </>
   );
};

export default Protected;
