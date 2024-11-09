// document.addEventListener('DOMContentLoaded', function() {
//     const searchParams = new URLSearchParams(window.location.search);
//     const userName = searchParams.get('userName');
//     console.log(userName);})

var ws;

window.addEventListener('beforeunload', function () {
    // 使用 navigator.sendBeacon 發送非同步請求，通知伺服器
    ws.close(1000, "Normal end");
    console.log("RELOAD");
});

// window.onload = function () {
document.addEventListener('DOMContentLoaded', function() {
    const fetchChatById = (id) => {
        console.log("Fetching chat history for ID:", id);
        
        fetch(`http://localhost:8081/TIA103G3_Servlet/api/chat/history?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(historyMap => {
                const chatBox = document.querySelector('#chat-content');
                chatBox.innerHTML = ""; // 清空舊的聊天紀錄
                
                const targetKey = `chat:history:${id}`;
                const historyList = historyMap[targetKey];

                if (Array.isArray(historyList)) {
                    historyList.forEach((message) => {
                        
                        const messageData = JSON.parse(message);
                        const pTag = document.createElement('p');
                        pTag.textContent = messageData.content;

                        if (messageData.sender === "employ") {
                            pTag.classList.add('left-message'); // 發出的訊息
                        } else {
                            pTag.classList.add('right-message'); // 接收的訊息
                        }

                        chatBox.appendChild(pTag);
                    });
                    chatBox.scrollTop = chatBox.scrollHeight; // 滾動至底部
                }
            })
            .catch(error => {
                console.error('Error fetching chat history:', error);
            });
    };

    var chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    document.body.appendChild(chatContainer);

    var chatHeader = document.createElement('div');
    chatHeader.id = 'chat-header';
    chatContainer.appendChild(chatHeader);
    chatHeader.innerHTML = '聊天室 <span id="chat-toggle">&#x25B2;</span>';

    var chatContent = document.createElement('div');
    chatContent.id = 'chat-content';
    chatContainer.appendChild(chatContent);

    var chatInput = document.createElement('div');
    chatContainer.appendChild(chatInput);
    chatInput.id = 'chatInput';

    var inputField = document.createElement('input');
    chatInput.appendChild(inputField);
    inputField.id = 'inputField';
    inputField.type = 'text';
    inputField.placeholder = '輸入訊息...';

    var sendButton = document.createElement('button');
    sendButton.id = 'sendButton';
    chatInput.appendChild(sendButton);

    //
    var chatToggle = document.getElementById('chat-toggle');
    chatContent.style.visibility = 'hidden';
    chatInput.style.visibility = 'hidden';
    chatToggle.innerHTML = '&#x25BC;';
    chatContainer.style.height = '50px';
    //

    // 發送訊息
    sendButton.onclick = async function () {

        const messageContent = inputField.value.trim();
        if (messageContent !== '') {
            // 將訊息包裝為 JSON 格式
            var json_str = JSON.stringify({
                id:JSON.parse(sessionStorage.getItem("id")),
                receiver : 500,
                sender : "member",                  // member : 會員  / employ : 客服
                content: messageContent,
                timestamp: new Date().toISOString() // 可選，附帶時間戳
            });
            
            
            try {
                ws.send(json_str); // 發送 JSON 格式的訊息到 WebSocket 伺服器
                displayMessage(messageContent, 'right-message'); // 顯示客戶端訊息
                inputField.value = ''; // 清空輸入框
            } catch (error) {
                console.error('無法發送訊息:', error);
            }
        }
    };


    function displayMessage(message, className) {
        var msgElement = document.createElement('p');
        msgElement.innerText = message;
        msgElement.classList.add(className);
        chatContent.appendChild(msgElement);
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    inputField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && inputField.value.trim() !== '') {
            sendButton.onclick();
        }
    });

    inputField.addEventListener('focus', function (event) {
        if (event.key === 'Enter' && inputField.value.trim() !== '') {
            sendButton.onclick();
        }
    });

    // document.getElementById('logoutBtn').addEventListener('click', async function (e) {
    //     if(sessionStorage.getItem("ws") != null || sessionStorage.getItem("ws") != false){

    //         ws.close(1000, "normal end");
    //     }
    // });

    chatHeader.onclick = function () {
        console.log("id:"+sessionStorage.getItem("id"))
        if (sessionStorage.getItem("id") == null){
            document.getElementById('login-popup').click();
            alert('請先登入');
        }else{
            var chatToggle = document.getElementById('chat-toggle');

            if(sessionStorage.getItem("ws") == null || sessionStorage.getItem("ws") == false){
                ws = new WebSocket('ws://localhost:8081/TIA103G3_Servlet/ChatWS/'+sessionStorage.getItem("id")); // 替換為你的 WebSocket 伺服器端點
                console.log("New WS");
                sessionStorage.setItem("ws", true);

                ws.onopen = function () {
                    console.log("Connected to WebSocket");                  
                    fetchChatById(sessionStorage.getItem("id"));
                    // document.getElementById("status").innerText = "已連接";
                };
        
                // 接收來自伺服器的訊息
                ws.onmessage = function (event) {
                    console.log("MSG:"+event.data);
                    // fetch chat/history to local 
                    
                    displayMessage(event.data, 'left-message');
                };
        
                ws.onclose = function (event) {
                    sessionStorage.removeItem('ws');
                    chatContent.style.visibility = 'hidden';
                    chatInput.style.visibility = 'hidden';
                    chatToggle.innerHTML = '&#x25BC;';
                    chatContainer.style.height = '50px';
                    console.log("WS CLOSE!!!!!!!!!!!!!!!!!1111");
                };

            }
            //心跳機制
            // function startHeartbeat() {
            //     setInterval(() => {
            //         if (ws.readyState === WebSocket.OPEN) {
            //             ws.send("ping"); // 發送心跳訊息
            //         }
            //     }, 10000); // 每 30 秒發送一次
            // }
            
            if (chatContent.style.visibility === 'hidden') {
                
                chatContent.style.visibility = 'visible';
                chatInput.style.visibility = 'visible';
                chatToggle.innerHTML = '&#x25B2;';
                chatContainer.style.height = '400px';
            } else {
                chatContent.style.visibility = 'hidden';
                chatInput.style.visibility = 'hidden';
                chatToggle.innerHTML = '&#x25BC;';
                chatContainer.style.height = '50px';
            }
        }
    };

});
// };
