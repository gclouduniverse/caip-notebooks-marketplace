import React, { useCallback, useContext } from "react";
import { Button } from "antd";
import { getSignBtnText, signIn, signOut } from "./utils";
import { CoreContext, CoreContextProps } from "../../app";

const noop = () => {};

const SignIn = () => {
  const {
    isUserSignedIn,
    isLoading,
    setIsUserSignedIn = noop,
    setIsLoading = noop
  } = useContext<CoreContextProps>(CoreContext);

  const handleOnSignIn = useCallback(() => {
    setIsLoading(true);
    if (isUserSignedIn) {
      signOut(() => {
        setIsUserSignedIn(false);
      });

      return;
    }
    signIn(() => {
      setIsUserSignedIn(true);
    });
  }, [isUserSignedIn, setIsUserSignedIn]);

  return (
    <Button loading={isLoading} onClick={handleOnSignIn}>
      {getSignBtnText(isLoading, isUserSignedIn)}
    </Button>
  );
};

export default SignIn;
