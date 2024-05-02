import React, { useState } from 'react';
import styles from './css/chatComponent.module.css'; // Ensure this path is correct

function ChatComponent() {
    const [messageBoxValue, setMessageBoxValue] = useState<string>(''); // Specify type as string
    const defaultConversation = [
        { text: "Hello! How can I assist you with your financial planning today?", isUser: false },
        // Additional messages...
    ];

    const [conversation, setConversation] = useState(defaultConversation);

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageBoxValue(e.target.value);
    };

    return (
        <div className={styles['tabs-container']}>
            <div className={styles['chat-tab']}>
                <div className={styles['chat-header']}>
                    <a href="#" className={`${styles['user-avatar']} ${styles['user-avatar-main']}`}></a>
                    <a href="#" className={styles['user-name']} title="Chatbot">Chatbot</a>
                    <span className={styles['user-state']}>Available</span>
                </div>
                <div className={styles['chat-body']}>
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
                    <form className={styles['message-form']}>
                        <textarea
                            className={styles['message']}
                            name="message"
                            id="message"
                            rows={1}
                            placeholder="Write a message..."
                            value={messageBoxValue}
                            onChange={handleMessageChange}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
