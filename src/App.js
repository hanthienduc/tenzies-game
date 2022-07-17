import React from "react";
import "./App.css";
import Die from "./components/Die.js";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = React.useState(allNewDice());

  const [tenzies, setTenzies] = React.useState(false);

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function allNewDice() {
    const arrayOfDice = [];
    for (let i = 0; i < 10; i++) {
      arrayOfDice.push(generateNewDie());
    }
    return arrayOfDice;
  }

  function rollNewDice(event, id) {
    if (tenzies) {
      return setDice(allNewDice());
      setTenzies(false);
    }

    setDice((prevState) => {
      return prevState.map((die) => {
        return die.isHeld ? die : generateNewDie();
      });
    });
  }

  function setHeldDie(event, id) {
    setDice((prevState) => {
      return prevState.map((die) => {
        return die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die;
      });
    });
  }

  React.useEffect(() => {
    const allHeld = dice.every((item) => item.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((item) => item.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies((prevTenzies) => !prevTenzies);
    }
  }, [dice]);

  const diceElements = dice.map((item) => (
    <Die
      key={item.id}
      value={item.value}
      isHeld={item.isHeld}
      handleClick={(event) => setHeldDie(event, item.id)}
    />
  ));

  return (
    <main className="app">
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <main className="dice-container">{diceElements}</main>
      <button className="roll-dice" onClick={rollNewDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
