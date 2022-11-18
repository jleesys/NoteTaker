const Note = ({note, toggleImportance}) => {
    return (
        <div>
            {note.content}&nbsp;
            <button onClick={toggleImportance}>{note.important ? 'Mark unimportant' : 'Mark important'}</button>
        </div>
    )
}

export default Note;