//----------------會員資料查看----------------//

document.addEventListener('DOMContentLoaded', function () {
    
    // 從 localStorage 中取出會員 email
    const userEmail = localStorage.getItem("account");

    if (userEmail) {
        // 使用 Fetch API 發送 POST 請求給後端
        fetch('http://localhost:8080/TIA103G3_Servlet/getOneMember', {
            method: 'POST', // 使用 POST 方法
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }) // 將 email 作為 JSON 格式傳送
        })
        .then(response => response.json()) // 將回應轉換為 JSON 格式
        .then(data => {
            // 在這裡處理獲得的會員資料，並將它們填入對應的表單欄位中

            console.log(data);
            
            document.getElementById('username').value = data.name !== null ? data.name : '請填寫您的姓名';
            document.getElementById('check_tell').value = data.tell !== null ? data.tell : '請填寫您的電話';
            document.getElementById('check_address').value = data.address !== null ? data.address : '請填寫您的地址';
            document.getElementById('check_birthday').value = data.birthday !== null ? data.birthday : '請填寫您的生日';
            document.getElementById('check_password').value = maskPassword(data.password);
        })
        .catch(error => {
            console.error('無法取得會員資料');
        });
    } else {
        console.error('找不到會員 Email');
    }

    // 只顯示部分密碼
    function maskPassword(password) {
        if (password && password.length > 4) {
            return password.substring(0, 2) + '*'.repeat(password.length - 4) + password.substring(password.length - 2);
        } else {
            return '*'.repeat(password.length);
        }
    }
});
//----------------會員資料查看----------------//
