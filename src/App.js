import React from "react";
import "./App.css";
import Die from "./components/Die.js";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [playername, setPlayername] = React.useState("");
  const [message, setMessage] = React.useState({});
  const [displayData, setDisplayData] = React.useState({});

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
      setTenzies(false);
      handleAddScore(event);
      setDice(allNewDice());
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
      setDisplayData((prevData) => ({
        ...prevData,
        score: prevData.score + 1,
      }));
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

  function handleChange(event) {
    const { value } = event.target;
    setPlayername(value);
  }

  let handleAddNewPlayer = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("https://tenzie-project.vercel.app/api/add-new-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playername,
        }),
      });
      let resJson = await res.json();
      if (res.status === 404) {
        setMessage((prevMessage) => {
          return {
            content: resJson.message,
            type: !prevMessage.type,
          };
        });
      }
      if (res.status === 200) {
        setPlayername("");
        setMessage((prevMessage) => {
          return {
            type: !prevMessage.type,
            content: resJson.message,
          };
        });
        setTimeout(() => {
          setMessage({});
        }, 2000);
        setDisplayData((prevData) => {
          return {
            score: 0,
            name: resJson.name,
          };
        });
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    const getDisplayData = JSON.parse(localStorage.getItem("displaydata"));
    if (getDisplayData) {
      setDisplayData(getDisplayData);
    }
  }, []);


  React.useEffect(() => {
    if (displayData.name) {
      localStorage.setItem("displaydata", JSON.stringify(displayData));
    }
  }, [displayData]);

  let handleAddScore = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("https://tenzie-project.vercel.app/api/add-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: displayData.score,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setMessage((prevMessage) => {
          return {
            type: !prevMessage.type,
            content: resJson.message,
          };
        });
        setTimeout(() => {
          setMessage({});
        }, 2000);
        setDisplayData((prevData) => {
          return {
            ...prevData,
            score: 0,
          };
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="app">
      {tenzies && <Confetti />}
      {message.content && (
        <p className={!message.type ? "error" : ""}>{message.content}</p>
      )}
      {displayData.name ? (
        <div className="display-data">
          <h4>Name: {displayData.name}</h4>
          <h4>Score: {displayData.score}</h4>
        </div>
      ) : (
        <form onSubmit={handleAddNewPlayer} className="form">
          <input
            name="name"
            placeholder="Player name?"
            value={playername}
            onChange={handleChange}
          />
          <button type="submit" className="btn-create">
            Create
          </button>
        </form>
      )}

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
