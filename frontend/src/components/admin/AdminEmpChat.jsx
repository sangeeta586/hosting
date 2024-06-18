import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import AdminFileUploadModel from "./Pages/AdminFileUploadModel";
import { FaVideo, FaImage } from "react-icons/fa";
import { useSound } from "use-sound";
import notificationSound from "../../assests/sound.wav";
import { BASE_URL } from "../../constants";

function AdminEmpChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [showMessages, setShowMessages] = useState({});
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [selectedSenderEmail, setSelectedSenderEmail] = useState("");
  const [playNotificationSound] = useSound(notificationSound);

  // Function to handle click on employee to initiate chat
  const handleClick = (id, name) => {
    setRecipient(id);
    setRecipientName(name);
    fetchMessages(loggedInUserId, id);
  };
// working
  // Function to fetch messages between two users
  console.log("sender......",loggedInUserId)
  const fetchMessages = (sender, recipient) => {
    axios
      .get(
        `${BASE_URL}/api/empadminsender/getadminmessages/${recipient}/${sender}`
      )
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Fetch all employees except the logged-in user
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employeeRegistration/`)
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user) => user._id !== loggedInUserId
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [loggedInUserId]);

  // Fetch initial messages between logged-in user and selected recipient
  useEffect(() => {
    if (loggedInUserId && recipient) {
      fetchMessages(loggedInUserId, recipient);
    }
  }, [loggedInUserId, recipient]);

  // Automatically scroll to bottom when new messages are received
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      recipient: recipient,
      text: newMessage,
      image: attachment?.type.startsWith("image/") ? attachment.url : null,
      document: attachment?.type.startsWith("application/")
        ? attachment.url
        : null,
      video: attachment?.type.startsWith("video/") ? attachment.url : null,
    };

    axios
      .post(`${BASE_URL}/api/empadminsender/createMessage`, messageData)
      .then((response) => {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        setAttachment(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to handle file attachment change
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment({
          url: reader.result,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered list of users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Fetch unread messages for all users at regular intervals
  useEffect(() => {
    if (users.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadUsersData = await Promise.all(
            users.map(async (user) => {
              const response = await axios.get(
                `${BASE_URL}/api/empadminsender/mark-messages-read/${user._id}`
              );
              return { userId: user._id, data: response.data };
            })
          );
          setUnreadUsers(unreadUsersData);
        } catch (error) {
          console.error(error);
        }
      };

      // Initial fetch and set interval to fetch every 3 seconds
      fetchUnreadMessages();
      const intervalId = setInterval(fetchUnreadMessages, 3000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [users]);

  // Toggle display of messages for each user
  const handleShowMessage = (userId) => {
    setShowMessages((prevShowMessages) => ({
      ...prevShowMessages,
      [userId]: !prevShowMessages[userId],
    }));
  };

  // Fetch pop-up SMS notifications for logged-in user
  const fetchPopSms = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/getNotification/${loggedInUserId}`
      );
      const data = response.data;
      setPopSms(data);
      if (data.length > 0) {
        const senderId = data[0].sender;
        setSelectedSender(senderId);
        setShowPopSms(true);
        const empDetails = await axios.get(
          `${BASE_URL}/api/employee/a/${senderId}`
        );
        setSelectedSenderName(empDetails.data.name);
        playNotificationSound();
      }
    } catch (error) {
      console.error("Error fetching pop SMS:", error);
    }
  };

  // Fetch pop-up SMS notifications at regular intervals
  useEffect(() => {
    const interval = setInterval(fetchPopSms, 5000);
    return () => clearInterval(interval);
  }, [loggedInUserId, playNotificationSound]);

  // Function to handle closure of pop-up SMS modal
  const handleModalClose = (senderId) => {
    axios
      .delete(`${BASE_URL}/api/deleteNotification/${senderId}`)
      .then(() => {
        setShowPopSms(false);
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">All Employees</h1>
        <div className="relative mb-4">
          <input
            type="text"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="w-full p-2 text-sm text-gray-700 bg-gray-200 rounded pl-10"
            placeholder="Search by name..."
          />
          <AiOutlineSearch className="absolute top-3 left-3 text-gray-500" />
        </div>
        <div className="h-1/2 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user._id}>
              <div
                className="w-full h-auto font-medium rounded-md bg-indigo-200 mb-4 text-2xl block items-center p-4 cursor-pointer"
                onClick={() => handleClick(user._id, user.name)}
              >
                <h1>{user.name}</h1>
                {unreadUsers
                  .filter((unreadUser) => unreadUser.userId === user._id)
                  .flatMap((unreadUser) =>
                    unreadUser.data.map((message) => (
                      <div
                        key={message._id}
                        className="text-green-400 flex justify-between items-center content-center gap-5 mt-2"
                        onClick={() => handleShowMessage(user._id)}
                      >
                        {!showMessages[user._id] ? (
                          <>
                            {message.content.text && (
                              <p className="pe-2 text-base">
                                {message.content.text}
                              </p>
                            )}
                            {message.content.image && <FaImage />}
                            {message.content.video && <FaVideo />}
                            {message.content.document && (
                              <IoIosDocument className="text-xl" />
                            )}
                            <p className="text-xs text-black">
                              {new Date(message.createdAt).toLocaleDateString()}{" "}
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    ))
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-4/5 p-4">
        <div className="flex justify-between items-center content-center mb-4">
          <h1 className="text-2xl font-bold">Chat with {recipientName}</h1>
          <Link
            to={"/"}
            className="group relative flex items-center justify-end font-extrabold text-2xl rounded-full p-3 md:p-5"
          >
            <BiLogOut />
          </Link>
        </div>
        <div className="flex flex-col h-4/5 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === loggedInUserId
                  ? "justify-end"
                  : "justify-start"
              } mb-2`}
            >
              <div
                className={`w-1/3 p-2 rounded-md ${
                  message.sender === loggedInUserId
                    ? "bg-blue-100 self-end"
                    : "bg-gray-200 self-start"
                }`}
              >
                {message?.content && message?.content?.text && (
                  <p className="text-sm">{message?.content?.text}</p>
                )}
                {message?.content?.image && (
                  <>
                    <img
                      src={message?.content?.image}
                      alt="Image"
                      className="max-w-xs rounded"
                    />
                  </>
                )}
                {message?.content && message?.content?.document && (
                  <a
                    href={message?.content?.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    <IoIosDocument className="text-9xl" />
                  </a>
                )}
                {message?.content && message?.content?.video && (
                  <video controls className="max-w-xs">
                    <source src={message?.content?.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex justify-center items-center w-3/4 fixed bottom-0 mb-0 pb-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 text-sm text-gray-700 bg-gray-200"
            placeholder="Type a message..."
          />
          <input
            type="file"
            onChange={handleAttachmentChange}
            className="hidden"
            id="file-upload"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Send
          </button>
          <AdminFileUploadModel sender={loggedInUserId} recipient={recipient} />
        </div>
      </div>

      {showPopSms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white relative p-6 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw]`}
          >
            {showPopSms && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div
                  className={`bg-white relative p-4 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw] animate-pop-up`}
                >
                  {popSms.length > 0 &&
                    popSms
                      .filter((sms) => sms.sender === selectedSender)
                      .map((sms) => (
                        <div
                          key={sms.id}
                          className="relative border border-gray-200 rounded-lg p-2 mb-2 shadow-sm"
                        >
                          <div className="flex items-center justify-center mb-1">
                            <i className="fas fa-bell text-yellow-500 text-sm mr-2"></i>
                            <h1 className="text-xl font-bold text-green-600 text-center">
                              {selectedSenderName}
                            </h1>
                            <h1 className="text-xl font-bold text-green-600 text-center">
                              {selectedSenderEmail}
                            </h1>
                          </div>
                          <p className="text-base font-bold mb-1">
                            {sms?.content?.text}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(sms.createdAt).toLocaleDateString()}{" "}
                            {new Date(sms.createdAt).toLocaleTimeString()}
                          </p>
                          <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => handleModalClose(sms.sender)}
                          >
                            Close
                          </button>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEmpChat;
