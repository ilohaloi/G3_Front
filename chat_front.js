// document.addEventListener('DOMContentLoaded', function() {
//     const searchParams = new URLSearchParams(window.location.search);
//     const userName = searchParams.get('userName');
//     console.log(userName);})
  

window.onload = function () {
    
    const ws = new WebSocket('ws://localhost:8081/TIA103G3_Servlet/ChatWS/vicTest'); // 替換為你的 WebSocket 伺服器端點
    

    ws.onopen = function () {
        console.log("Connected to WebSocket");
        document.getElementById("status").innerText = "已連接";
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

// 發送訊息
sendButton.onclick = function () {
    const messageContent = inputField.value.trim();
    if (messageContent !== '') {
        // 將訊息包裝為 JSON 格式
        const message = JSON.stringify({
            empoId: 1, // 假設是員工 ID，實際上應該由前端資料獲取
            membId: 2, // 假設是會員 ID
            content: messageContent,
            timestamp: new Date().toISOString() // 可選，附帶時間戳
        });

        try {
            ws.send(message); // 發送 JSON 格式的訊息到 WebSocket 伺服器
            displayMessage(messageContent, 'cus_Message'); // 顯示客戶端訊息
            inputField.value = ''; // 清空輸入框
        } catch (error) {
            console.error('無法發送訊息:', error);
        }
    }
};

    // 接收來自伺服器的訊息
    ws.onmessage = function (event) {
        displayMessage(event.data, 'csMessage');
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

    chatHeader.onclick = function () {
        var chatToggle = document.getElementById('chat-toggle');
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
    };
};
