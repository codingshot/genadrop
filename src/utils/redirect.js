import React, { useEffect, useState } from "react";
import Fallback from "../pages/fallback/fallback";

const RedirectLinks = {
  "/twitter": "https://twitter.com/genadrop",
  "/linkedin": "https://www.linkedin.com/company/genadrop/",
  "/youtube": "https://www.youtube.com/c/minorityprogrammers",
  "/tutorials": "https://www.youtube.com/playlist?list=PLfkTuB2ltX12uhYARs5GbE0stptAFSacC",
  "/github": "https://github.com/codingshot/genadrop",
  "/build": "https://linktr.ee/MinorityProgrammers",
  "/reddit": "https://www.reddit.com/r/genadrop/",
  "/discord": "https://discord.gg/4vdtmQqz6d",
  "/merch": "https://nearswag.xyz/collections/genadrop",
  "/docs": "https://github.com/GenaDrop/docs",
  "/dao": "https://near.org/ndcplug.near/widget/DAO.main?daoId=drop.sputnik-dao.near",
  "/gateway": "https://bos.genadrop.io",
  "/bos": "https://genadrop.near.social",
  "/telegram": "https://t.me/GenaDrop",
  // "/docs": "https://docs.genadrop.io",
};

const Redirect = () => {
  const [fallStatus, setFallStatus] = useState(false);

  useEffect(() => {
    const url = RedirectLinks[window.location.pathname];
    if (url) {
      window.location.href = url;
    } else if (window.location.pathname === window.location.pathname.toLowerCase()) {
      setFallStatus(true);
    } else {
      window.location.href = window.location.pathname.toLowerCase();
    }
  }, []);
  return fallStatus ? <Fallback /> : <></>;
};
export default Redirect;
