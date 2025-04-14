export const initialState = {
  input: "",
  letters: [],
  error: "",
};

export const letterReducer = (state, action) => {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload, error: "" };

    case "ADD_LETTER":
      return {
        ...state,
        letters: [...state.letters, action.payload],
        input: "",
        error: "",
      };

    case "SHUFFLE":
      return {
        ...state,
        letters: [...state.letters].sort(() => Math.random() - 0.5),
      };

    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
