import React from "react";
import "antd/dist/antd.min.css";
import Layout from "../components/Layout";

type CoreContextProps = {
  isUserSignedIn: boolean;
};

const initialCoreContext = {
  isUserSignedIn: false
};

export const CoreContext = React.createContext<CoreContextProps>(initialCoreContext);

/** App entry point */
const App = () => {
  return (
    <CoreContext.Provider value={initialCoreContext}>
      <Layout />
    </CoreContext.Provider>
  );
};

export default App;
