import React, { useState, useEffect, useRef } from 'react';
import styles from './css/chatComponent.module.css'; // Ensure this path is correct

function ChatComponent({ onSendMessage, conversation }) {
    const [messageBoxValue, setMessageBoxValue] = useState('');
    const chatBodyRef = useRef(null); // Creates a ref for the chat body container

    useEffect(() => {
        if (chatBodyRef.current) {
            const { scrollHeight, clientHeight } = chatBodyRef.current;
            chatBodyRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [conversation]); // Runs every time the conversation updates

    const handleMessageChange = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents the default action of the enter key (new line)
            if (messageBoxValue.trim()) { // Prevents sending empty messages
                onSendMessage(messageBoxValue.trim());
                setMessageBoxValue(''); // Clears the text area after sending
            }
        } else {
            setMessageBoxValue(e.target.value);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevents the form from submitting traditionally
        if (messageBoxValue.trim()) {
            onSendMessage(messageBoxValue.trim());
            setMessageBoxValue('');
        }
    };

    return (
        <div className={styles['tabs-container']}>
            <div className={styles['chat-tab']}>
                <div className={styles['chat-header']}>
                    <span className={styles['user-name']} title="Chatbot">Chatbot</span>
                    <span className={styles['user-state']}>Available</span>
                </div>
                <div className={styles['chat-body']} ref={chatBodyRef}> {/* Attaches ref here */}
                    <div className={styles['chat-container']} id="conversation">
                        {conversation.map((message, index) => (
                            <div key={index} className={`${styles['chat']} ${message.isUser ? styles['chat-user'] : ''}`}>
                                <span className={`${styles['chat-text']} ${!message.isUser ? styles['chat-chatbot'] : ''}`}>
                                    {message.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles['chat-footer']}>
                    <form onSubmit={handleFormSubmit} className={styles['message-form']}>
                        <textarea
                            className={styles['message']}
                            name="message"
                            id="message"
                            rows={1}
                            placeholder="Write a message..."
                            value={messageBoxValue}
                            onChange={handleMessageChange}
                            onKeyPress={handleMessageChange} // Handles key press for Enter submission
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
