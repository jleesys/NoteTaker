const Notification = ({message}) => {

    if (message == null) return (
        <></>
    )

    var styleError = {
        color: 'red',
        fontWeight: 700
    }
    var styleNotification = {
        color: 'green',
        fontWeight: 700
    }

    return (
        <div style={message.includes("Error") ? styleError : styleNotification}>
            {message}
        </div>
    )
}

export default Notification;