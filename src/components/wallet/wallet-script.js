import { setNotification, setProposedChain, setConnector } from "../../gen-state/gen.actions";

const isAlgoConnected = async (connector) => {
  if (connector.connected) {
    await connector.disconnect();
    console.log("algo disconnected");
  }
};

export const connectWithQRCode = async ({ provider, dispatch }) => {
  try {
    await provider.enable();
    dispatch(setConnector(provider));
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

export const connectWithMetamask = async ({ dispatch, connector, supportedChains, proposedChain }) => {
  let res;
  res = await supportedChains[proposedChain].switch(proposedChain);
  if (!res) {
    await isAlgoConnected(connector);
    console.log("connected successfully");
  } else if (res.message.includes("Unrecognized")) {
    res = await supportedChains[proposedChain].add(proposedChain);
    if (!res) {
      await isAlgoConnected(connector);
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
