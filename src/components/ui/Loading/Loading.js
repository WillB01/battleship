import React from 'react';

const Loading = ({ children }) => {
  return (
    <>
      {children}
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Loading;
