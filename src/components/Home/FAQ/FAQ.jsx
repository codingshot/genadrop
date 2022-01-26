import { useState } from 'react';
import classes from './FAQ.module.css';
import FQACard from './FAQCard';

const FQA = () => {
  const [state, setState] = useState({
    dropdown: ''
  })
  const { dropdown } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const FAQS = [
    {
        question: "How do i start using GenaDrop",
        answer: "Create Your assets in the same .png size, Name each layer and upload relevant asset to it after which you will see the preview. "
    },
    {
        question: "How do i create assets",
        answer: "Create Your assets in the same .png size, Name each layer and upload relevant asset to it after which you will see the preview. "
    },
    {
        question: "what are the requirement for each asset",
        answer: "Create Your assets in the same .png size, Name each layer and upload relevant asset to it after which you will see the preview. "
    },
    {
        question: "How do i sell my collections",
        answer: "Create Your assets in the same .png size, Name each layer and upload relevant asset to it after which you will see the preview. "
    },
    {
        question: "Is GenaDrop a paid service?",
        answer: "Create Your assets in the same .png size, Name each layer and upload relevant asset to it after which you will see the preview. "
    },
]


  return (
    <div className={classes.container}>
      <div className={classes.heading}>Frequently Asked Questions</div>
      <div className={classes.FQAs}>
        {
          FAQS.map((FAQ, index) => (
            <FQACard key={index} FAQ={FAQ} id={index} dropdown={dropdown} handleSetState={handleSetState}/>
          ))
        }
      </div>
    </div>
  )
}

export default FQA;