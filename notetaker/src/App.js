import Note from "./components/note";
import { useEffect, useState } from "react";
import axios from "axios";
import notesServices from './services/notesServ'
import notesServ from "./services/notesServ";


// const testNotes = [
//   { content: "Test Note 1", id: 1, important: true, date: new Date().toISOString() },
//   { content: "Test Note 2", id: 2, important: false, date: new Date().toISOString() },
//   { content: "Test Note 3", id: 3, important: true, date: new Date().toISOString() },
//   { content: "Test Note 4", id: 4, important: false, date: new Date().toISOString() },
// ]

function App() {
  // const [notes, setNotes] = useState(testNotes);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [notesToShow, setNotesToShow] = useState(notes);
  window.notes = notes;

  useEffect(() => {
    console.log('effect')
    notesServices
      .getAll()
      .then(response => {
        setNotes(response)
        setNotesToShow(response)
      })
  }, [])

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
      important: false,
      date: new Date().toISOString()
    }
    setNotes(notes.concat(noteToAdd));

    notesServices
      .postNew(noteToAdd)
    setNoteText("");
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
    setNotesToShow(notes);

    notesServices.putUpdate(newNote, id).catch(err => console.log('oopsy woopsy', err));
  }

  const deleteNote = (id) => {
    notesServices.remove(id);
    setNotes(notes.filter(note => note.id !== id));
  }

  useEffect(() => {
    console.log('using effect hook...')
    setNotesToShow(showAll ? notes : notes.filter(note => note.important))
  }, [notes, showAll])

  const handleShowAll = () => {
    setShowAll(!showAll);
  }

  return (
    <div>
      <h1>Note Taker</h1>
      <h2>Add Notes</h2>
      <form onSubmit={handleNoteSubmission}>
        <input onChange={handleNoteInput} value={noteText} placeholder="Enter note here"></input>
        <div>
          <button type="submit">Submit Note</button>
        </div>
      </form>
      <h2>Notes</h2>
      <button onClick={() => handleShowAll()}>{showAll ? 'Show important only' : 'Show All'}</button>
      <ul>
        {notesToShow.map(note => <Note note={note} deleteNote={() => deleteNote(note.id)} toggleImportance={() => toggleImportance(note.id)} key={note.id} />)}
      </ul>
    </div>
  );
}

export default App;
