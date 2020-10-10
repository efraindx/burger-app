import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import useHttpErrorHandler from '../../hooks/http-error-handler';
import { AxiosInstance } from 'axios';

const withErrorHandler = (WrappedComponent: React.FC<any>, axios: AxiosInstance) => {
  return (props: any) => {
    const [error, clearError] = useHttpErrorHandler(axios);
    
    return (
      <>
        {
          error ? 
          <Modal show modalClosed={clearError}>
            {error.message}
          </Modal>
          : null
        }
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withErrorHandler;
