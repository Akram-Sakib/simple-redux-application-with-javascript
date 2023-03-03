// Select DOM elements
const addMatchEl = document.getElementById("add-match");
const deleteMatchEl = document.getElementById("delete-match");
const incrementScoreEl = document.getElementById("increment");
const decrementScoreEl = document.getElementById("decrement");
const resetScoreEl = document.getElementById("reset");
const matchContainerEl = document.getElementById("match-container");

// Action Types
const ADD_MATCH = "ADD_MATCH";
const DELETE_MATCH = "DELETE_MATCH";
const INCREMENT_SCORE = "INCREMENT_SCORE";
const DECREMENT_SCORE = "DECREMENT_SCORE";
const RESET_ALL_SCORE = "RESET_SCORE";

// Initial State
const initialState = {
  matches: [
    {
      id: 1,
      score: 0,
    },
  ],
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MATCH:
      return {
        ...state,
        matches: [...state.matches, action.payload],
      };
    case DELETE_MATCH:
      return {
        ...state,
        matches: state.matches.filter((match) => match.id !== action.payload),
      };
    case INCREMENT_SCORE:
      return {
        ...state,
        matches: state.matches.map((match) => {
          if (match.id === action.payload.id) {
            return {
              ...match,
              score: match.score + action.payload.value,
            };
          }
          return match;
        }),
      };
    case DECREMENT_SCORE:
      return {
        ...state,
        matches: state.matches.map((match) => {
          if (match.id === action.payload.id) {
            return {
              ...match,
              score:
                match.score < action.payload.value
                  ? 0
                  : match.score - action.payload.value,
            };
          }
          return match;
        }),
      };
    case RESET_ALL_SCORE:
      return {
        ...state,
        matches: state.matches.map((match) => {
          return { ...match, score: 0 };
        }),
      };
    default:
      return state;
  }
};

// Store
const store = Redux.createStore(reducer);

// Action Creators

const addMatch = () => {
  const match = {
    id:
      store.getState().matches.length === 0
        ? 1
        : store.getState().matches[store.getState().matches.length - 1].id + 1,
    score: 0,
  };
  return {
    type: ADD_MATCH,
    payload: match,
  };
};

const deleteMatch = (id) => {
  return {
    type: DELETE_MATCH,
    payload: parseInt(id),
  };
};

const incrementScore = (id, value) => {
  return {
    type: INCREMENT_SCORE,
    payload: {
      id: parseInt(id),
      value: parseInt(value),
    },
  };
};

const decrementScore = (id, value) => {
  return {
    type: DECREMENT_SCORE,
    payload: {
      id: parseInt(id),
      value: parseInt(value),
    },
  };
};

const resetScore = (id) => {
  return {
    type: RESET_ALL_SCORE,
    payload: parseInt(id),
  };
};

// Event Listeners
addMatchEl.addEventListener("click", () => {
  store.dispatch(addMatch());
});

incrementScoreEl.addEventListener("click", (e) => {
  e.preventDefault();
  store.dispatch(incrementScore(1));
});

decrementScoreEl.addEventListener("click", (e) => {
  e.preventDefault();
  store.dispatch(decrementScore(1));
});

resetScoreEl.addEventListener("click", () => {
  store.dispatch(resetScore(1));
});

// functions
const removeMatch = (id) => {
  store.dispatch(deleteMatch(id));
};

const incrementSubmit = (id) => {
  const value = document.getElementById(`increment-${id}`).value;
  if (value === "") {
    return;
  } else {
    store.dispatch(incrementScore(id, value));
  }
};

const decrementSubmit = (id) => {
  const value = document.getElementById(`decrement-${id}`).value;
  if (value === "") {
    return;
  } else {
    store.dispatch(decrementScore(id, value));
  }
};

// Render
const render = () => {
  const matches = store.getState().matches;
  const matchContainerEl = document.getElementById("match-container");
  matchContainerEl.innerHTML = "";
  i = 0;

  matches.forEach((match) => {
    const matchEl = document.createElement("div");
    matchEl.classList.add("match");
    matchEl.innerHTML = `
                <div class="wrapper">
                    <button class="lws-delete" id="delete-match" onClick="removeMatch('${match.id}')">
                        <img src="./image/delete.svg" alt="" />
                    </button>
                    <h3 class="lws-matchName">Match ${match.id}</h3>
                </div>
                <div class="inc-dec">
                    <form class="incrementForm" id="increment" onSubmit="incrementSubmit(${match.id})">
                        <h4>Increment</h4>
                        <input type="number" name="increment" id="increment-${match.id}" class="lws-increment" />
                    </form>
                    <form class="decrementForm" id="decrement" onSubmit="decrementSubmit(${match.id})">
                        <h4>Decrement</h4>
                        <input type="number" name="decrement" id="decrement-${match.id}" class="lws-decrement" />
                    </form>
                </div>
                <div class="numbers">
                    <h2 class="lws-singleResult">${match?.score}</h2>
                </div>
        `;
    matchContainerEl.appendChild(matchEl);
  });
};

store.subscribe(render);
render();
