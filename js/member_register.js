
//------------------會員註冊------------------//

document.getElementById('registerBtn').addEventListener('click', function(event) {
    event.preventDefault(); // 防止表單的默認提交行為

    // 獲取表單元素
    const registerBtn = document.getElementById('registerBtn');
    const passwordField = document.getElementById('register_password');
    const passwordConfirmField = document.getElementById('password_confirm');
    const nameField = document.getElementById('register_name');
    const emailField = document.getElementById('register_email');
    const formMessages = document.querySelector('.form-messages');

    if (!registerBtn || !passwordField || !passwordConfirmField || !nameField || !emailField) {
        console.error('表單元素未找到，無法進行註冊操作。');
        return;
    }

    formMessages.innerText = ''; // 清空之前的錯誤提示

    // 驗證用戶輸入
    const password = passwordField.value.trim();
    const passwordConfirm = passwordConfirmField.value.trim();
    const name = nameField.value.trim();
    const email = emailField.value.trim();

    if (name === '') {
        formMessages.innerText = '請輸入您的姓名';
        return;
    }

    if (password !== passwordConfirm) {
        alert('密碼不一致，請重新輸入');
        passwordConfirmField.value = ''; // 清除確認密碼欄位
        return;
    }   

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        alert('請輸入正確的電子郵件格式');
        return;
    }  

    // 禁用註冊按鈕，防止重複提交
    const disableButton = (disabled) => {
        registerBtn.disabled = disabled;
    };

    disableButton(true);

    // 使用 Fetch API 提交表單數據
    fetch('http://localhost:8081/TIA103G3_Servlet/MemberRegister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
        })
    })
    .then(response => {
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
            return response.json();
        } else if (response.status === 400) {
            alert('資料不完整，請檢查必填欄位。');
            throw new Error('資料不完整，請檢查必填欄位。');
        } else if (response.status === 409) {
            alert('該電子郵件已被使用，請更換電子郵件。');
            throw new Error('該電子郵件已被使用，請更換電子郵件。');
        } else {
            alert('註冊失敗，請稍後再試。');
            throw new Error('註冊失敗，請稍後再試。');
        }
    })
    .then(data => {
        // 註冊成功後顯示登入表單
        alert('註冊成功！即將顯示登入頁面。');

        // 隱藏註冊表單
        document.getElementById('pills-profile').classList.remove('active', 'show');
        
        // 顯示登入表單
        document.getElementById('pills-home').classList.add('active', 'show');
    })
    .catch(error => {
        // 註冊失敗，顯示錯誤訊息
        formMessages.innerText = '註冊失敗：' + error.message;
    })
    .finally(() => {
        // 重啟按鈕
        disableButton(false);
    });
});



//------------------會員註冊------------------//