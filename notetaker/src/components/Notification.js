const Notification = ({message}) => {

    if (message == null) return (
        <></>
    )

    var styleError = {
        color: 'red',
        fontWeight: 700,
        borderWidth: 5,
        padding: 15,
        marginBottom: '7px',
        borderStyle: 'solid',
        borderColor: 'red'
    }
    var styleNotification = {
        // color: 'green',
        // fontWeight: 700
        ...styleError, color: 'green',
        borderColor: 'green'
    }

    return (
        <div style={message.includes("Error") ? styleError : styleNotification}>
            {message}
        </div>
    )
}

export default Notification;