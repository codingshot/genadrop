import { setNotification, setProposedChain } from "../../gen-state/gen.actions";

const isAlgoConnected = async (provider) => {
  if (provider.connected) {
    await provider.disconnect();
    console.log("algo disconnected");
  }
};

export const connectWithQRCode = async ({ provider, dispatch }) => {
  try {
    await provider.enable();
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

export const connectWithMetamask = async ({ dispatch, provider, supportedChains, proposedChain }) => {
  let res;
  res = await supportedChains[proposedChain].switch(proposedChain);
  if (!res) {
    await isAlgoConnected(provider);
    console.log("connected successfully");
  } else if (res.message.includes("Unrecognized")) {
    res = await supportedChains[proposedChain].add(proposedChain);
    if (!res) {
      await isAlgoConnected(provider);
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
