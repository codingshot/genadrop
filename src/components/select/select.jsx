import React, { useState } from "react";
import cx from "./select.module.css";

const Select = ({ heading, selectionList, select, selected }) => {
  const [toggle, toggleShow] = useState(false);
  const [inShow, setInShow] = useState(-1);

  const handleClick = (id) => {
    if (inShow === id) {
      toggleShow(!toggle);
    } else {
      toggleShow(true);
    }
    setInShow(id);
  };

  const getHeight = (layer) => `${selectionList[layer].length * 3}em`;

  const handleAddAttribute = (data) => {
    select(data);
  };

  const isSlected = (data) => {
    const result = JSON.stringify(selected).includes(JSON.stringify(data));
    return result;
  };

  return (
    <div className={cx.container}>
      <div className={cx.heading}>{heading}</div>
      <div className={cx.layersContainer}>
        {Object.keys(selectionList).map((layer, idx) => (
          <div key={idx} className={cx.layers}>
            <div onClick={() => handleClick(idx)} className={cx.layer}>
              <span>{layer}</span>
              <i className="fas fa-angle-down" />
            </div>
            <div
              style={{
                height: inShow === idx && toggle ? getHeight(layer) : "0",
              }}
              className={`${cx.attributes}`}
            >
              {selectionList[layer].map((data, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    handleAddAttribute({
                      layer,
                      attr: data.traitTitle,
                      image: data.image,
                    })
                  }
                  className={cx.attribute}
                >
                  <span className={cx.icon}>
                    {isSlected({
                      layer,
                      attr: data.traitTitle,
                      image: data.image,
                    }) ? (
                      <i className="fas fa-times" />
                    ) : (
                      <i className="fas fa-minus" />
                    )}
                  </span>
                  <span>{data.traitTitle}</span>
                  <img src={URL.createObjectURL(data.image)} alt="" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
