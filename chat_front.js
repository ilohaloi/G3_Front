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
    
        // Check if the customer is logged in by looking for their ID in sessionStorage
        // const membId = sessionStorage.getItem('membId'); // Retrieve the customer ID

        // if (!membId) {
        //     alert('請先登入才能使用聊天室');
        //     window.location.href = 'login.html'; // Redirect to the login page if not logged in
        //     return;
        // }

    // if(sessionStorage.getItem("ws") ==true){
    //     ws.onopen = function () {
    //         console.log("Connected to WebSocket");
    //         // document.getElementById("status").innerText = "已連接";
    //     };

    //     // 接收來自伺服器的訊息
    //     ws.onmessage = function (event) {
    //         console.log("MSG:"+event.data);
    //         displayMessage(event.data, 'csMessage');
    //     };

    //     ws.onclose = function (event) {
    //         sessionStorage.removeItem('ws');
    //     };
    // }


    

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

    console.log("dddddddddddENDddddddddddddddd:"+sessionStorage.getItem("ws"));

    var member_data;

    // 發送訊息
    sendButton.onclick = async function () {
        // alert('請先登入:'+sessionStorage.getItem("account"));
        try {


            accountData = {
                id : sessionStorage.getItem("account")
            };
            // 發送 POST 請求到後端 API
            const response = await fetch('http://localhost:8081/TIA103G3_Servlet/ChatMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(accountData) // {id : 1} 
            });
            
            // 檢查是否登錄成功
            if (response.status === 200) {
                
                member_data = await response.json();
                console.log(member_data);

            } else if(response.status === 401){
                console.error('Fetch 錯誤:', error);
                alert('連接伺服器失敗，請檢查網路連線或稍後再試。');
            }
            
        } catch (error) {
            console.error('Fetch 錯誤:', error);
            alert('連接伺服器失敗，請檢查網路連線或稍後再試。');
        }

        const messageContent = inputField.value.trim();
        if (messageContent !== '') {
            // 將訊息包裝為 JSON 格式
            var json_str = JSON.stringify({
                content: messageContent,
                timestamp: new Date().toISOString() // 可選，附帶時間戳
            });
            const message = `${member_data.id}:${json_str}`;
            
            try {
                ws.send(message); // 發送 JSON 格式的訊息到 WebSocket 伺服器
                displayMessage(messageContent, 'cus_Message'); // 顯示客戶端訊息
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
        console.log("id:"+sessionStorage.getItem("account"))
        if (sessionStorage.getItem("account") == null){
            document.getElementById('login-popup').click();
            alert('請先登入');
        }else{
            var chatToggle = document.getElementById('chat-toggle');

            if(sessionStorage.getItem("ws") == null || sessionStorage.getItem("ws") == false){
                ws = new WebSocket('ws://localhost:8081/TIA103G3_Servlet/ChatWS/'+sessionStorage.getItem("account")); // 替換為你的 WebSocket 伺服器端點
                console.log("New WS");
                sessionStorage.setItem("ws", true);

                ws.onopen = function () {
                    console.log("Connected to WebSocket");
                    // document.getElementById("status").innerText = "已連接";
                };
        
                // 接收來自伺服器的訊息
                ws.onmessage = function (event) {
                    console.log("MSG:"+event.data);
                    displayMessage(event.data, 'csMessage');
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
