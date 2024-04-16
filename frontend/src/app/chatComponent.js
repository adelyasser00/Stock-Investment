import { useState } from 'react';
import styles from './css/chatComponent.module.css'; // replace with your actual CSS module file

function ChatComponent() {
    const [messageBoxValue, setMessageBoxValue] = useState('');
    const [isMinimized, setIsMinimized] = useState(false); // State to track if the chat is minimized
    const defaultConversation = [
        { text: "Lorem ipsum dolor Lorem ipsum dolor sit, amet consectetur adipisicing elit.", isUser: false },
        { text: "Lorem :).", isUser: true },
        { text: "Lorem ipsum dolor", isUser: false },
        { text: "Lorem", isUser: true },
        { text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", isUser: false },
        { text: "Lorem ipsum", isUser: true }
    ];
    const [conversation, setConversation] = useState(defaultConversation);

    // Toggle chat window visibility
    const toggleChat = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className={styles['tabs-container']}>
            <div className={styles['chat-tab']}>
                <div className={styles['chat-header']} onClick={toggleChat}>
                    <a href="#" className={`${styles['user-avatar']} ${styles['user-avatar-main']}`}></a>
                    <a href="#" className={styles['user-name']} title="Chatbot">
                        Chatbot
                    </a>
                    <span className={styles['user-state']}>
                        Available
                    </span>
                    <div className={`${styles['chat-options']} ${styles['options-header']}`}>

                        <i className={`${styles['icon']} ${styles['close']}`} title="Toggle chat"></i>
                    </div>
                </div>
                {!isMinimized && (
                    <>
                        <div className={styles['chat-body']}>
                            <div className={styles['chat-container']} id="conversation">
                                {conversation.map((message, index) => (
                                    <div key={index}
                                         className={`${styles['chat']} ${message.isUser ? styles['chat-user'] : ''}`}>
                                        <span className={`${styles['chat-text']} ${!message.isUser ? styles['chat-chatbot'] : ''}`}>{message.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles['chat-footer']}>
                            <form className={styles['message-form']}>
                                <textarea className={styles['message']} name="message" id="message" rows="1"
                                          placeholder="Write a message..." value={messageBoxValue} onChange={(e) => setMessageBoxValue(e.target.value)}></textarea>
                            </form>
                            <div className={`${styles['chat-options']} ${styles['options-footer']}`}>
                                <i className={`${styles['icon']} ${styles['image']}`}></i>
                                <i className={`${styles['icon']} ${styles['sticker']}`}></i>
                                <i className={`${styles['icon']} ${styles['gif']}`}></i>
                                <i className={`${styles['icon']} ${styles['emoji']}`}></i>
                                <i className={`${styles['icon']} ${styles['game']}`}></i>
                                <i className={`${styles['icon']} ${styles['clip']}`}></i>
                                <i className={`${styles['icon']} ${styles['camera']}`}></i>
                                <i className={`${styles['icon']} ${styles['calendar']}`}></i>
                                <i className={`${styles['icon']} ${styles['like']}`}></i>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ChatComponent;
