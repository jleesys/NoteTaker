const Note = ({note}) => {
    return (
        <div>
            {note.content}&nbsp;
            <button>{note.important ? 'Mark unimportant' : 'Mark important'}</button>
        </div>
    )
}

export default Note;