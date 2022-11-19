const Note = ({note, toggleImportance, deleteNote}) => {
    return (
        <div>
            {note.content}&nbsp;
            <button onClick={toggleImportance}>{note.important ? 'Mark unimportant' : 'Mark important'}</button>
            <button onClick={deleteNote}>Delete</button>
        </div>
    )
}

export default Note;