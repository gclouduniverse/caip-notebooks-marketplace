import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import Layout from "../components/Layout";
import FIREBASE_CNM from "../common/firebase";

export type CoreContextProps = {
  isUserSignedIn: boolean;
  isLoading: boolean;
  setIsUserSignedIn?: (isUserSignedIn: boolean) => void;
};

const initialCoreContext = {
  isUserSignedIn: false,
  isLoading: true
};

console.log(initialCoreContext);

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
  }, [coreState]);

  const providerValue = {
    ...coreState,
    setIsUserSignedIn: (isUserSignedIn: boolean) =>
      setCoreState({ ...coreState, isUserSignedIn })
  };

  return (
    <CoreContext.Provider value={providerValue}>
      <Layout />
    </CoreContext.Provider>
  );
};

export default App;
