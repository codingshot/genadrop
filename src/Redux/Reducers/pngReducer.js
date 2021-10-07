import axios from 'axios'
// import rectangle0 from './gena/Rectangle0.png'


const initialState = {
    background : [
        {id:0 , png: './images/Rectangle0.png', name : 'orange'},
        {id:1 , png: './images/Rectangle1.png', name : 'orange-gradient'},
        {id:2 , png: './images/Rectangle2.png', name : 'purple-gradient'},
        {id:3 , png: './images/Rectangle3.png', name : 'blue-gradient'},
        {id:4 , png: '/images/Rectangle4.png', name : 'red-gradient'},
        {id:5 , png: '/images/Rectangle5.png', name : 'violet-gradient'},
        {id:6 , png: '/images/Rectangle6.png', name : 'green-gradient'}
    ],
    head:[
        {id:0 , png: '/images/head0.png', name : 'head1'},
        {id:1 , png: '/images/head1.png', name : 'head2'},
        {id:2 , png: '/images/head2.png', name : 'head3'},
        {id:3 , png: '/images/head3.png', name : 'head4'},
        {id:4 , png: '/images/head4.png', name : 'head5'},
        {id:5 , png: '/images/head5.png', name : 'head6'},
        {id:6 , png: '/images/head6.png', name : 'head7'}
    ],
    outfit:[
        {id:0 , png: '/images/outfit0.png', name : 'outfit1'},
        {id:1 , png: '/images/outfit1.png', name : 'outfit2'},
        {id:2 , png: '/images/outfit2.png', name : 'outfit3'},
        // {id:3 , png: '/images/outfit3.png', name : 'orange'},
        {id:4 , png: '/images/outfit4.png', name : 'outfit4'},
        {id:5 , png: '/images/outfit5.png', name : 'outfit5'},
        {id:6 , png: '/images/outfit6.png', name : 'outfit6'}
    ]
 }
const GET_BACKGROUND = "GET_BACKGROUND";
const GET_HEAD = "GET_HEAD";
const GET_OUTFIT = "GET_OUTFIT";


export function getBackground() {
    return {
      type: GET_BACKGROUND,
      payload: axios.get(`/api/background`)
    };
  }
  export function getHead() {
    return {
      type: GET_BACKGROUND,
      payload: axios.get(`/api/head`)
    };
  }
  export function getOutfit() {
    return {
      type: GET_BACKGROUND,
      payload: axios.get(`/api/outfit`)
    };
  }
  export default function reducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case `${GET_BACKGROUND}_FULFILLED`:
        return {
          ...state,
          id:payload.data,
          png:payload.data,
          name :payload.data
        };
        case `${GET_HEAD}_FULFILLED`:
            return {
              ...state,
              id:payload.data,
              png:payload.data,
              name :payload.data
            };
            case `${GET_OUTFIT}_FULFILLED`:
                return {
                  ...state,
                  id:payload.data,
                  png:payload.data,
                  name :payload.data
                };
  
      default:
        return state;
    }
  }
  