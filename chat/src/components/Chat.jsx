import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

// eslint-disable-next-line react/prop-types
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // eslint-disable-next-line react/prop-types
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  function onPress(event) {
    //console.log(event.key)
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => {
      // eslint-disable-next-line react/prop-types
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="header">
        <h4>Live Chat</h4>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username == messageContent.author ? "you" : "other"}
              >
                <div className="msg">
                  <h4 id="author">{messageContent.author}</h4>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={onPress}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
