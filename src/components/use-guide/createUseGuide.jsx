import { useState } from 'react';
import classes from './createUseGuide.module.css'

const createGuideIntro = {
  "title": "Welcome to Genadrop",
  "sub-title": "The easy and Robust No Code art generating tool that gives you quality and unique art. Let's work you through the process.",
  "preview": "/assets/create-use-guide0.svg"
}

const createUseGuide = {
  1: {
    "title": "Add layers",
    "sub-title": "Click on the 'Add Layer' button to create layers for your art. Examples of layers can be the Eye layer, head layer, background layer, etc. Yep!",
    "preview": "/assets/create-use-guide1.svg"
  },
  2: {
    "title": "Upload assets",
    "sub-title": " Use the upload button to add the images associated with the layer names you created in the previous step. For example, eyes uploaded to the eye layer, and heads uploaded to the head layer. Yes. Looks simple right?",
    "preview": "/assets/create-use-guide2.svg"
  },
  3: {
    "title": "Re-order layers",
    "sub-title": "Re-order layers to suit your design/art. You can Re-order layers by simply dragging a layer to the top or bottom on the layers panel and seeing results on the preview panel.",
    "preview": "/assets/create-use-guide3.svg"
  },
  4: {
    "title": "Input number of arts to generate",
    "sub-title": "Input the number of arts you want to generate from the total combinations and click the 'generate button' Boom! Your art is ready. Now, you can use the preview button to see your generated Arts/Designs.",
    "preview": "/assets/create-use-guide4.svg"
  },
  5: {
    "title": "Set conflict rule",
    "sub-title": "Setting conflict rules for images means that the selected set of images cannot form a generative art.",
    "preview": "/assets/create-use-guide5.svg"
  },
}

const guideLength = Object.keys(createUseGuide).length;


const CreatePageUseGuide = ({ toggleGuide, setGuide }) => {
  const [state, setState] = useState({
    pointer: 1,
    showGuide: false
  });

  const { pointer, showGuide } = state;
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleNext = () => {
    if (pointer >= guideLength) return;
    handleSetState({ pointer: pointer + 1 })
  }

  const handlePrev = () => {
    if (pointer <= 1) return;
    handleSetState({ pointer: pointer - 1 })
  }

  const control = (
    <div className={classes.control}>
      <div className={classes.indicator}>
        {
          (Array(guideLength).fill(null)).map((_, idx) => (
            <span
              key={idx}
              onClick={() => handleSetState({ pointer: idx + 1 })}
              className={`${idx + 1 === pointer && classes.active}`}>

            </span>
          ))
        }
      </div>
      <button onClick={handlePrev} className={`${classes.prev} ${pointer > 1 && classes.active}`}>prev</button>
      <button onClick={handleNext} className={`${classes.next} ${pointer < guideLength && classes.active}`}>next</button>
    </div>
  );

  const content = (
    <div className={classes.content}>
      <div className={classes.title}>{createUseGuide[pointer]["title"]}</div>
      <div className={classes.subTitle}>{createUseGuide[pointer]["sub-title"]}</div>
      <img className={classes.preview} src={createUseGuide[pointer]["preview"]} alt="" />
    </div>
  );

  const intro = (
    <div className={classes.content}>
      <div className={classes.title}>{createGuideIntro["title"]}</div>
      <div className={classes.subTitle}>{createGuideIntro["sub-title"]}</div>
      <img className={classes.preview} src={createGuideIntro["preview"]} alt="" />
    </div>
  );

  const introControl = (
    <div className={classes.introControl}>
      <button onClick={()=> setGuide(false)}>cancel</button>
      <button onClick={()=> handleSetState({showGuide: true})}>Get started</button>
    </div>
  )

  return (
    <div className={`${classes.container} ${toggleGuide && classes.active}`}>
      <div className={classes.guideContainer}>
        {showGuide && <img onClick={() => setGuide(false)} className={classes.close} src="/assets/icon-close.svg" />}
        {showGuide ? content : intro}
        {showGuide ? control : introControl}
      </div>
    </div>
  )
}

export default CreatePageUseGuide;