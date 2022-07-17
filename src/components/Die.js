export default function Die(props) {
  return (
    <div
      className={`die-face ${props.isHeld ? "held" : ""}`}
      onClick={props.handleClick}
    >
      <h2 className="die-num">{props.value}</h2>
    </div>
  );
}
