import React, { useReducer } from "react";
import "./App.css";
import { initialState, letterReducer } from "./services/letters";


function App () {
  const [state, dispatch] = useReducer(letterReducer, initialState);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 1 && /^[A-Z]?$/.test(value)) {
      dispatch({ type: "SET_INPUT", payload: value });
    }else{
      dispatch({type : "SET_ERROR", payload: "Il faut une lettre majuscule"})
    } 
  };


  const handleAddLetter = () => {
    if (state.input === "") {
      dispatch ({type: "SET_ERROR", payload: "Le champ est vide"}) 
  }
  else if (state.letters.includes(state.input)){
    dispatch({type : "SET_ERROR", payload: "La lettre a déjà été rentré"})
  }
  else  {
    dispatch({type : "ADD_LETTER", payload : state.input})
  }
  };

  const shuffleLetters = () => {
    dispatch({ type: "SHUFFLE" });
  };


  return (
    <div>
      <h2>Gestion des Lettres</h2>
      <input type="text" value={state.input} onChange={handleInputChange} placeholder="Lettre" maxLength={1}style={{ textTransform: "uppercase" }}/>
      <button onClick={handleAddLetter} disabled={state.input === "" || state.input.length !== 1 || !/^[A-Z]$/.test(state.input)}>
        Ajouter
      </button>
      <button onClick={shuffleLetters}>Mélanger</button>
      {state.error && <p>{state.error}</p>}
      <div>
        <h3>Lettres ajoutées :</h3>
        <ul>
          {state.letters.map((letter, i) => (
            <li key={i}>{letter}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
