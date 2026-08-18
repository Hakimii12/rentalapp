import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { render, RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer, { initialState } from "@/state";
import { api } from "@/state/api";

type GlobalStateOverride = Partial<typeof initialState>;

export const createTestStore = (globalState?: GlobalStateOverride) =>
  configureStore({
    reducer: {
      global: globalReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState: {
      global: {
        ...initialState,
        ...globalState,
        filters: {
          ...initialState.filters,
          ...globalState?.filters,
        },
      },
    },
  });

export const renderWithStore = (
  ui: React.ReactElement,
  globalState?: GlobalStateOverride,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const store = createTestStore(globalState);

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
};
