import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import Layout from "../components/Layout";
import FIREBASE_CNM from "../common/firebase";

export type CoreContextProps = {
  isUserSignedIn: boolean;
  isLoading: boolean;
  setIsLoading?:(isLoading: boolean) => void;
  setIsUserSignedIn?: (isUserSignedIn: boolean) => void;
};

const initialCoreContext = {
  isUserSignedIn: false,
  isLoading: true
};

export const CoreContext = React.createContext(initialCoreContext);

/** App entry point */
const App = () => {
  const [coreState, setCoreState] = useState<CoreContextProps>(
    initialCoreContext
  );

  useEffect(() => {
    FIREBASE_CNM.auth().onAuthStateChanged(function(user) {
      if (user) {
        setCoreState({ ...coreState, isUserSignedIn: true, isLoading: false });
      } else {
        setCoreState({ ...coreState, isLoading: false });
      }
    });
    // eslint-disable-next-line
  }, []);

  const providerValue = {
    ...coreState,
    setIsLoading: (isLoading: boolean) =>
      setCoreState({ ...coreState, isLoading }),
    setIsUserSignedIn: (isUserSignedIn: boolean) =>
      setCoreState({ ...coreState, isUserSignedIn, isLoading: false })
  };

  return (
    <CoreContext.Provider value={providerValue}>
      <Layout />
    </CoreContext.Provider>
  );
};

export default App;
