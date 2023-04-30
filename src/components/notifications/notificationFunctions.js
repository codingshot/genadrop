import * as PushAPI from "@pushprotocol/restapi";

export const subscribeToChannel = async ({ account, connector, dispatch, setNotification }) => {
  const _signer = connector.getSigner();
  try {
    await PushAPI.channels.subscribe({
      signer: _signer,
      channelAddress: "eip155:80001:0xFb6d5fAa665783f4E4A1f5B198797C4d39478F13",
      userAddress: `eip155:80001:${account}`,
      onSuccess: () => {
        dispatch(
          setNotification({
            type: "success",
            message: "Successfully subscribed to channel",
          })
        );
      },
      onError: () => {
        dispatch(
          setNotification({
            type: "warning",
            message: "Unsuccessful, Something went wrong",
          })
        );
      },
      env: "staging",
    });
  } catch (error) {
    dispatch(
      setNotification({
        type: "warning",
        message: "Unsuccessful, Something went wrong",
      })
    );
  }
};

export const unSubscribeFromChannel = async ({ account, connector, dispatch, setNotification }) => {
  const _signer = connector.getSigner();
  try {
    await PushAPI.channels.unsubscribe({
      signer: _signer,
      channelAddress: "eip155:80001:0xFb6d5fAa665783f4E4A1f5B198797C4d39478F13",
      userAddress: `eip155:80001:${account}`,
      onSuccess: () => {
        dispatch(
          setNotification({
            type: "success",
            message: "Successfully UnSubscribed from the channel",
          })
        );
      },
      onError: () => {
        dispatch(
          setNotification({
            type: "warning",
            message: "Unsuccessful, Something went wrong",
          })
        );
      },
      env: "staging",
    });
  } catch (error) {
    dispatch(
      setNotification({
        type: "warning",
        message: "Unsuccessful, Something went wrong",
      })
    );
  }
};
