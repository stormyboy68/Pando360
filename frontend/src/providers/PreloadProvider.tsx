'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '@/store/slices/user/userSlice';

interface PreloadProviderProps {
  children: React.ReactNode;
  initialData: any;
}

const PreloadProvider = ({ children, initialData }: PreloadProviderProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      dispatch(loadUser({ user: initialData }));
    }
  }, [dispatch, initialData]);

  return <>{children}</>;
};

export default PreloadProvider; 