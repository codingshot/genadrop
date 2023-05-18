/* eslint-disable no-shadow */
import { useCallback, useState } from "react";
import interval from "./interval";

const use1Second = interval(100);

const useTimer = ({ seconds: initialSeconds = 0, running: initiallyRunning = false } = {}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(initiallyRunning);
  const tick = useCallback(() => (running ? setSeconds((seconds) => seconds + 10) : undefined), [running]);
  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => setSeconds(0);
  const stop = () => {
    pause();
    reset();
  };

  use1Second(tick);

  return { pause, reset, running, seconds, start, stop };
};
export default useTimer;
