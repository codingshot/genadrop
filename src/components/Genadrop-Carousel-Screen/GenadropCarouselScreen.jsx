import { useEffect, useRef, useState } from "react";
import classes from "./GenadropCarouselScreen.module.css";
import { ReactComponent as IconRight } from "../../assets/icon-angle-right.svg";
import { ReactComponent as IconLeft } from "../../assets/icon-angle-left.svg";
import { useWheel } from "@use-gesture/react";

const GenadropCarouselScreen = ({ children, cardWidth, gap = 16, init = true }) => {
  const cardContainerRef = useRef(null);
  const run = useRef(null);
  const wrapperRef = useRef(null);

  const [state, setState] = useState({
    wrapperWidth: 0,
    slideCount: 0,
    scrollLength: 0,
  });

  const { wrapperWidth, slideCount, scrollLength } = state;
  const [slideActiveCount, setSlideActiveCount] = useState(0);
  const [remainder, setRemainder] = useState(0);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleSlideLeft = () => {
    if (slideActiveCount <= 0) return;
    setSlideActiveCount((sc) => sc - 1);
  };

  const handleSlideRight = () => {
    if (slideActiveCount >= slideCount) return;
    setSlideActiveCount((sc) => sc + 1);
  };

  const bind = useWheel(({ wheeling, movement: [x] }) => {
    if (x > 0 && run.current) {
      handleSlideRight();
      run.current = false;
    } else if (x < 0 && run.current) {
      handleSlideLeft();
      run.current = false;
    }

    if (!wheeling) {
      run.current = true;
    }
  });

  useEffect(() => {
    const width = wrapperRef.current && wrapperRef.current.getBoundingClientRect().width;
    const cardsInView = Math.floor(width / (cardWidth + gap / 2));
    let scrollLength = null;
    if (slideCount - slideActiveCount <= 0 && remainder) {
      scrollLength = slideActiveCount * remainder * cardWidth + slideActiveCount * remainder * gap;
      if (remainder === 1) {
        scrollLength += cardWidth + gap;
      }
    } else {
      scrollLength = slideActiveCount * cardsInView * cardWidth + slideActiveCount * cardsInView * gap;
    }
    handleSetState({ scrollLength });
    cardContainerRef.current.style.transform = `translateX(-${scrollLength}px)`;
  }, [slideActiveCount]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      handleSetState({ wrapperWidth: wrapperRef.current && wrapperRef.current.getBoundingClientRect().width });
    });
  }, []);

  const getCount = (len, view) => {
    if (len % view === 0) {
      return Math.floor(len / view) - 1;
    } else {
      return Math.floor(len / view);
    }
  };

  useEffect(() => {
    const width = wrapperRef.current && wrapperRef.current.getBoundingClientRect().width;
    const cardTotalLength = children.length;
    const cardsInView = Math.floor(width / (cardWidth + gap / 2));
    const slideCount = getCount(cardTotalLength, cardsInView);
    setRemainder(cardTotalLength % cardsInView);
    handleSetState({ slideCount });
    if (!slideCount) {
      setSlideActiveCount(0);
    }
    let res = Math.floor(Math.floor(scrollLength / (cardWidth + gap / 2)) / slideActiveCount / cardsInView);
    if (slideActiveCount === 0) return;
    setSlideActiveCount(res);
  }, [wrapperWidth, children]);

  useEffect(() => {
    setSlideActiveCount(0);
  }, [init]);

  return (
    <div className={classes.container}>
      <div ref={wrapperRef} className={classes.wrapper} {...bind()}>
        <div style={{ gap }} ref={cardContainerRef} className={classes.cardContainer}>
          {children}
        </div>
        {slideCount ? (
          <>
            <button
              onClick={handleSlideLeft}
              className={`${classes.ctrlBtn_left} ${slideActiveCount && classes.active}`}
            >
              <IconLeft alt="" />
            </button>
            <button
              onClick={handleSlideRight}
              className={`${classes.ctrlBtn_right} ${slideActiveCount < slideCount && classes.active}`}
            >
              <IconRight alt="" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GenadropCarouselScreen;
