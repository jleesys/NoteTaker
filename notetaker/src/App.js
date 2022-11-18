import note from "./components/note";
import { useState } from "react";


const testNotes = [
  {content:"Test Note 1"},
  {content:"Test Note 2"},
  {content:"Test Note 3"},
  {content:"Test Note 4"}
]

function App() {
  const [notes, setNotes] = useState(testNotes);
  const [noteText, setNoteText] = useState("");
  window.notes = notes;

  const handleNoteInput = (event) => {
    setNoteText(event.target.value);
  } 
  const handleNoteSubmission = (event) => {
    event.preventDefault();
    const noteToAdd = {
      content: noteText
    } 
    setNotes(notes.concat(noteToAdd));
  }

  return (
    <div>
      <h1>Note Taker</h1>
      <h2>Add Notes</h2>
      <form onSubmit={handleNoteSubmission}>
        <input onChange={handleNoteInput} placeholder="Enter note here"></input>
        <div>
          <button type="submit">Submit Note</button>
        </div>
      </form>
      <h2>Notes</h2>
      {notes.map(note => <div>{note.content}</div>)}
    </div>
  );
}

export default App;
