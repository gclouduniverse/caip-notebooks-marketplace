import React from "react";

type Props = {
  isSignedIn?: boolean;
};

const Header = ({ isSignedIn = false }: Props) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <h5 className="my-0 mr-md-auto font-weight-normal">
        Unofficial Cloud AI Platform Notebooks Marketplace
      </h5>
      <a className="my-0 mr-md-auto font-weight-normal" id="userNameText">
        Company name
      </a>
      {!isSignedIn && (
        <a className="btn btn-outline-primary" href="#" id="signInBtn">
          Sign In
        </a>
      )}
      {isSignedIn && (
        <a className="btn btn-outline-primary" href="#" id="signOutBtn">
          Sign Out
        </a>
      )}
    </div>
  );
};

export default Header;
