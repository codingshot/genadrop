import { useEffect, useRef, useState } from "react";
import classes from "./GenadropCarouselScreen.module.css";
import iconRight from "../../assets/icon-angle-right.svg";
import iconLeft from "../../assets/icon-angle-left.svg";

const GenadropCarouselScreen = ({ children, cardWidth, gap = 16 }) => {
  const cardContainerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [state, setState] = useState({
    wrapperWidth: 0,
    slideCount: 0,
  });

  const { wrapperWidth, slideCount } = state;
  const [slideActiveCount, setSlideActiveCount] = useState(0);

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

  useEffect(() => {
    const width = wrapperRef.current && wrapperRef.current.getBoundingClientRect().width;
    const cardsInView = Math.floor(width / (cardWidth + gap / 1.5));
    const axisLen = slideActiveCount * cardsInView * cardWidth + slideActiveCount * cardsInView * gap;
    cardContainerRef.current.style.transform = `translateX(-${axisLen}px)`;
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
    const cardsInView = Math.floor(width / (cardWidth + gap / 1.5));
    const slideCount = getCount(cardTotalLength, cardsInView);
    handleSetState({ slideCount });
    if (!slideCount) {
      setSlideActiveCount(0);
    }
    setSlideActiveCount(0);
  }, [wrapperWidth, children]);

  return (
    <div className={classes.container}>
      <div ref={wrapperRef} className={classes.wrapper}>
        <div style={{ gap }} ref={cardContainerRef} className={classes.cardContainer}>
          {children}
        </div>
        {slideCount ? (
          <>
            <button
              onClick={handleSlideLeft}
              className={`${classes.ctrlBtn_left} ${slideActiveCount && classes.active}`}
            >
              <img src={iconLeft} alt="" />
            </button>
            <button
              onClick={handleSlideRight}
              className={`${classes.ctrlBtn_right} ${slideActiveCount < slideCount && classes.active}`}
            >
              <img src={iconRight} alt="" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GenadropCarouselScreen;
