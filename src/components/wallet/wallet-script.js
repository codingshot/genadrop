import { setNotification, setProposedChain, setConnector } from "../../gen-state/gen.actions";

const isAlgoConnected = async (walletProvider) => {
  if (walletProvider.connected) {
    await walletProvider.disconnect();
    console.log("algo disconnected");
  }
};

export const connectWithQRCode = async ({ walletProvider, dispatch }) => {
  try {
    await walletProvider.enable();
    dispatch(setConnector(walletProvider));
  } catch (error) {
    console.log("error: ", error);
    dispatch(
      setNotification({
        message: "Connection failed",
        type: "error",
      })
    );
    dispatch(setProposedChain(null));
  }
};

export const connectWithMetamask = async ({ dispatch, walletProvider, supportedChains, proposedChain }) => {
  let res;
  res = await supportedChains[proposedChain].switch(proposedChain);
  if (!res) {
    await isAlgoConnected(walletProvider);
  } else if (res.message.includes("Unrecognized")) {
    res = await supportedChains[proposedChain].add(proposedChain);
    if (!res) {
      await isAlgoConnected(walletProvider);
      console.log("added successfully");
    } else {
      dispatch(
        setNotification({
          message: "Failed to add network",
          type: "error",
        })
      );
      dispatch(setProposedChain(null));
    }
  } else {
    dispatch(
      setNotification({
        message: "Connection failed",
        type: "error",
      })
    );
    dispatch(setProposedChain(null));
  }
};
