import note from "./components/note"

const testNotes = [
  "Test Note 1",
  "Test Note 2",
  "Test Note 3",
  "Test Note 4"
]
function App() {
  return (
    <div>
      <h1>Note Taker</h1>
      <h2>Add Notes</h2>
      <form></form>
      <h2>Notes</h2>
      {testNotes.map(note => <div>{note}</div>)}
    </div>
  );
}

export default App;
