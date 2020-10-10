import { useState, useEffect } from 'react';
import { AxiosInstance } from 'axios';

export default (axiosInstance: AxiosInstance) : [Error | null, (() => void)] => {
    const [error, setError] = useState<Error | null>(null);

    const reqInterceptor = axiosInstance.interceptors.request.use(req => {
      setError(null);
      return req;
    });

    const resInterceptor = axiosInstance.interceptors.response.use(
      res => res,
      (err: Error)=> {
        setError(err);
      }
    );

    useEffect(() => {
      return () => {
        axiosInstance.interceptors.request.eject(reqInterceptor);
        axiosInstance.interceptors.response.eject(resInterceptor);
      };
    }, [reqInterceptor, resInterceptor, axiosInstance]);

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return [error, errorConfirmedHandler];
}