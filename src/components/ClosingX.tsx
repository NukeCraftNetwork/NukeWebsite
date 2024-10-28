export default function ClosingX(props: { callback: () => void }) {
  return (
    <button onClick={() => props.callback()}>
      <p>❌</p>
    </button>
  );
}
