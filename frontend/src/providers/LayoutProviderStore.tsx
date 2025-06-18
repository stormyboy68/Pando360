"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

interface ILayoutProviderStore {
  children: React.ReactNode;
}

const LayoutProviderStore = ({ children }: ILayoutProviderStore) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default LayoutProviderStore;
