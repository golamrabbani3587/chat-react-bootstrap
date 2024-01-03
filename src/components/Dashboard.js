
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../App.css'

const socket = io("http://localhost:3001", { transports: ["websocket"] });

function Dashboard() {
    let [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [users, setUsers] = useState([]);
    const [openUser, setOpenUser] = useState({});
    const [loggedUser, setLoggedUser] = useState();
    let [allMessages, setAllMessages] = useState([])

    useEffect(() => {
        // Check if the token is available in local storage
        const token = localStorage.getItem('token');
        let user = localStorage.getItem('user');
        if (token) {
            setLoggedUser(JSON.parse(user));
            // Token is available, log "hello" to the console
            console.log('hello');
        } else {
            // Token is not available, redirect to "/page"
            window.location.href = '/';
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jwtToken = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/get-all-user', {
                    headers: {
                        Authorization: jwtToken,
                    },
                });
                setUsers(response.data.users);
                setOpenUser(response.data.users[0])
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error.message);
        });

        socket.on('chat message', (msg) => {
            console.log(msg, 'message comming');
            const newMsg = {
                toId : msg.toUserId,
                fromId : msg.fromUserId,
                message: msg.text
            }
            setAllMessages((prevMessages) => [...prevMessages, newMsg]);
        });

        return () => {
            if (socket.readyState === 1) {
                socket.close();
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            const messageData = {
                text: inputValue,
                fromUserId: loggedUser.id,
                toUserId: openUser._id,
            };
            socket.emit('chat message', messageData);
            setInputValue('');
        }
    };

    const handleListItemClick = async (recipientUser) => {
        // Join socket room
        socket.emit('join', { senderId: loggedUser.id, recipientId: recipientUser._id });

        // Update the openUser state
        setOpenUser(recipientUser);
        getMessagesFromServer()
    };


const getMessagesFromServer = async () => {
  // Fetch messages
  const jwtToken = localStorage.getItem('token');
  const response = await axios.post(
    'http://localhost:3001/get-message',
    { fromId: loggedUser.id, toId: openUser._id },
    {
      headers: {
        Authorization: jwtToken
      }
    }
  );
 
  console.log(response.data.data);
  // Update the messages state
  setAllMessages(response.data.data);
  console.log(allMessages, 'here all message');
};



    return (
        <div class="container">
            <div class="row clearfix">
                <div class="col-lg-12">
                    <div class="card chat-app">
                        <div id="plist" class="people-list">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fa fa-search"></i></span>
                                </div>
                                <input type="text" class="form-control" placeholder="Search..." />
                            </div>
                            <ul class="list-unstyled chat-list mt-2 mb-0">
                                {users.map((user, index) => (
                                    <li key={index} className="clearfix" onClick={() => handleListItemClick(user)}>
                                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                        <div className="about">
                                            <div className="name">
                                                <p> {user.username}</p>
                                            </div>
                                            <div className="status">
                                                <i className="fa fa-circle offline"></i> left 7 mins ago
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div class="chat">
                            <div class="chat-header clearfix">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                                        </a>
                                        <div class="chat-about">
                                            <h6 class="m-b-0">{openUser.username}</h6>
                                            <small>Last seen: 2 hours ago</small>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 hidden-sm text-right">
                                        <a href="javascript:void(0);" class="btn btn-outline-secondary"><i class="fa fa-camera"></i></a>
                                        <a href="javascript:void(0);" class="btn btn-outline-primary"><i class="fa fa-image"></i></a>
                                        <a href="javascript:void(0);" class="btn btn-outline-info"><i class="fa fa-cogs"></i></a>
                                        <a href="javascript:void(0);" class="btn btn-outline-warning"><i class="fa fa-question"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div class="chat-history">
                                <ul class="m-b-0">


                                    {allMessages.map((msg, index) => (
                                        <div>

                                            {loggedUser.id === msg.fromId ? (

                                                <li class="clearfix">
                                                    <div class="message-data text-right">
                                                        <span class="message-data-time">10:10 AM, Today</span>
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                    </div>
                                                    <div class="message other-message float-right">{msg.message} </div>
                                                </li>
                                            ) : (
                                                null // You can use null for the "else" case if you want nothing to be rendered
                                            )}
                                        </div>
                                    ))}

                                    {allMessages.map((msg, index) => (
                                        <div>
                                            {loggedUser.id === msg.toId ? (
                                                <li class="clearfix">
                                                    <div class="message-data">
                                                        <span class="message-data-time">10:12 AM, Today</span>
                                                    </div>
                                                    <div class="message my-message">{msg.message}</div>
                                                </li>
                                            ) : (
                                                null // You can use null for the "else" case if you want nothing to be rendered
                                            )}
                                        </div>
                                    ))}


                                </ul>
                            </div>
                            <div class="chat-message clearfix">
                                <div class="input-group mb-0">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fa fa-send"></i></span>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter text here..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />          </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the component
export default Dashboard;