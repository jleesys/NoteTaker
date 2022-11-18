import Note from "./components/note";
import { useState } from "react";


const testNotes = [
  { content: "Test Note 1", id: 1, important: true },
  { content: "Test Note 2", id: 2, important: false },
  { content: "Test Note 3", id: 3, important: true },
  { content: "Test Note 4", id: 4, important: false },
]

function App() {
  const [notes, setNotes] = useState(testNotes);
  const [noteText, setNoteText] = useState("");
  window.notes = notes;

  const generateNewID = () => {
    return (Math.max(...notes.map(note => note.id)) + 1);
  }

  const handleNoteInput = (event) => {
    setNoteText(event.target.value);
  }

  const handleNoteSubmission = (event) => {
    event.preventDefault();
    const noteToAdd = {
      content: noteText,
      id: generateNewID(),
      important: false
    }
    setNotes(notes.concat(noteToAdd));
  }

  const toggleImportance = (id) => {
    console.log('Changing importance')
    const noteToChange = notes.find(note => note.id === id);
    const newNote = {
      ...noteToChange, important: !noteToChange.important
    }
    setNotes(
      notes.map(existingNote => existingNote.id !== id ? existingNote : newNote)
    )
    console.log('Importance changed')
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
      {notes.map(note => <Note note={note} toggleImportance={() => toggleImportance(note.id)} key={note.id} />)}
    </div>
  );
}

export default App;
