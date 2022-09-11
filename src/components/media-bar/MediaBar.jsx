import React from "react";
import "@splidejs/splide/dist/css/splide.min.css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import classes from "./MediaBar.module.css";

const MediaBar = ({ MediaLogos }) => {
  return (
    <Splide
      options={{
        type: "loop",
        gap: "1rem",
        drag: "free",
        arrows: false,
        pagination: false,
        perPage: 3,
        autoScroll: {
          pauseOnHover: true,
          pauseOnFocus: false,
          rewind: false,
          speed: 1,
        },
        breakpoints: {
          600: {
            perPage: 2,
          },
        },
      }}
      extensions={{ AutoScroll }}
    >
      {MediaLogos.map((logo) => (
        <SplideSlide>
          <div>
            <a href={logo.url} target="_blank" rel="noreferrer" className={classes.slide} tabIndex="-1">
              <img src={logo.srcActive} alt={logo.url} />
            </a>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default MediaBar;
