//----------------會員資料查看----------------//

document.addEventListener('DOMContentLoaded', function () {
    
    // 從 localStorage 中取出會員 email和password
    const userID = sessionStorage.getItem("id");
    // const userPassword = localStorage.getItem("Password");

    if (userID) {
        // 使用 Fetch API 發送 POST 請求給後端
        fetch('http://localhost:8081/TIA103G3_Servlet/getOneMember', {
            method: 'POST', // 使用 POST 方法
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userID}) // 將 ID 作為 JSON 格式傳送
        })
        .then(response => response.json()) // 將回應轉換為 JSON 格式
        .then(data => {
            // 在這裡處理獲得的會員資料，並將它們填入對應的表單欄位中

            console.log(data);
            
            document.getElementById('username').value = data.name !== null ? data.name : '';
            document.getElementById('check_tell').value = data.tell !== null ? data.tell : '';
            document.getElementById('check_address').value = data.address !== null ? data.address : '';
            document.getElementById('check_birthday').value = data.birthday !== null ? data.birthday : '';
            
        })
        .catch(error => {
            console.error('無法取得會員資料');
        });
    } else {
        console.error('找不到會員 ID');
    }


});
//----------------會員資料查看----------------//
