//----------------會員資料修改----------------//
document.addEventListener("DOMContentLoaded", function () {

    // 選取所有 input 元素並添加 focus 和 blur 事件
    const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="date"]');

    inputs.forEach(input => {
        let originalValue = input.value; // 保存原本的值

        // 當 input 獲得焦點時，不清空值，允許直接修改
        input.addEventListener('focus', function () {
            originalValue = this.value; // 保存當前值，以防需要恢復
        });

        // 當 input 失去焦點時，恢復原本的值（如果未輸入新內容）
        input.addEventListener('blur', function () {
            if (this.value.trim() === '') { // 如果沒有輸入有效的新值
                this.value = originalValue; // 恢復為原本的值
            }
        });
    });

        // 設置生日欄位的行為
        const birthdayInput = document.getElementById('check_birthday');
        if (birthdayInput.value) { // 如果生日欄位已有值
            birthdayInput.setAttribute('readonly', true); // 設置為只讀狀態，禁止修改
        }

        // 設置密碼欄位為 password 類型，輸入時顯示 *
        const passwordInput = document.getElementById('check_password');
        const passwordConfirmInput = document.getElementById('check_password_confirm');
        passwordInput.setAttribute('type', 'password');
        passwordConfirmInput.setAttribute('type', 'password');

        // 表單提交時的處理
        const memberForm = document.getElementById('memberUpdateForm');
        memberForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // 檢查 password 欄位是否為空，若為空則從 localStorage 中取得密碼
        const passwordField = document.getElementById('check_password');
        const confirm_passwordField = document.getElementById('check_password_confirm');
        let password = passwordField.value;
        if (!password) { // 如果 password 為空
            password = localStorage.getItem('password'); // 從 localStorage 中取得密碼
            passwordField.value = password; // 將取得的密碼填入輸入欄位
            confirm_passwordField.value = password;
        }

        // 從表單中取得輸入的資料
        const updatedMemberData = {
            id: localStorage.getItem('ID'), 
            name: document.getElementById('username').value,
            tell: document.getElementById('check_tell').value,
            address: document.getElementById('check_address').value,
            birthday: document.getElementById('check_birthday').value,
            password: password, // 使用處理後的 password 值
            password_confirm: document.getElementById('check_password_confirm').value
        };

        // 簡單驗證：確認密碼是否一致
        if (updatedMemberData.password !== updatedMemberData.password_confirm) {
            alert('密碼與確認密碼不相符，請重新輸入。');
            return;
        }

        // 使用 Fetch API 發送 POST 請求給後端進行會員資料修改
        fetch('http://localhost:8081/TIA103G3_Servlet/updateMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMemberData) // 將更新後的會員資料作為 JSON 格式傳送
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 處理回應數據
            console.log('更新成功', data);
            alert('會員資料更新成功！');
        })
        .catch(error => {
            console.error('更新失敗:', error);
            alert('更新失敗，請稍後再試。');
        });
    });
});
//----------------會員資料修改----------------//
