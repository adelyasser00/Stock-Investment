import { useState } from 'react';
import styles from './css/chatComponent.module.css'; // replace with your actual CSS module file

function ChatComponent() {
    const [messageBoxValue, setMessageBoxValue] = useState('');
    const defaultConversation = [
        { text: "Hello! How can I assist you with your financial planning today?", isUser: false },
        { text: "Hi, I'm thinking about investing in stocks. Any advice?", isUser: true },
        { text: "Investing in stocks is a great way to build wealth. It's important to diversify your portfolio to reduce risk. Are you looking for safe blue-chip stocks or are you interested in higher risk, higher reward options?", isUser: false },
        { text: "I think I prefer something safer.", isUser: true },
        { text: "In that case, you might consider large-cap stocks, or perhaps mutual funds that provide exposure to a wide range of sectors. Have you thought about how much you want to invest?", isUser: false },
        { text: "Not sure, maybe around $5,000 to start with?", isUser: true },
        { text: "That's a solid start. Investing $5,000 in a diversified mutual fund or a low-cost index fund could be a good way to enter the market while minimizing risk.", isUser: false },
        { text: "Sounds good. How do I get started?", isUser: true },
        { text: "You'll need to open a brokerage account if you don't already have one. I can guide you through the process or recommend brokers if you'd like.", isUser: false },


    ];

    const [conversation, setConversation] = useState(defaultConversation);

    return (
        <div className={styles['tabs-container']}>
            <div className={styles['chat-tab']}>
                <div className={styles['chat-header']}>
                    <a href="#" className={`${styles['user-avatar']} ${styles['user-avatar-main']}`}></a>
                    <a href="#" className={styles['user-name']} title="Chatbot">
                        Chatbot
                    </a>
                    <span className={styles['user-state']}>
                        Available
                    </span>
                    <div className={`${styles['chat-options']} ${styles['options-header']}`}>
                        {/*<i className={`${styles['icon']} ${styles['close']}`} title="Toggle chat"></i>*/}
                    </div>
                </div>
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
                    {/*<div className={`${styles['chat-options']} ${styles['options-footer']}`}>*/}
                    {/*    <i className={`${styles['icon']} ${styles['image']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['sticker']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['gif']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['emoji']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['game']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['clip']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['camera']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['calendar']}`}></i>*/}
                    {/*    <i className={`${styles['icon']} ${styles['like']}`}></i>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
