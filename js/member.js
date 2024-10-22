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
        formMessages.innerText = '密碼不一致，請重新輸入';
        passwordConfirmField.value = ''; // 清除確認密碼欄位
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        formMessages.innerText = '請輸入有效的電子郵件地址';
        return;
    }

    // 禁用註冊按鈕，防止重複提交
    const disableButton = (disabled) => {
        registerBtn.disabled = disabled;
    };

    disableButton(true);

    // 使用 Fetch API 提交表單數據
    fetch('http://localhost:8080/TIA103G3_Servlet/MemberRegister', {
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
            throw new Error('資料不完整，請檢查必填欄位。');
        } else if (response.status === 409) {
            throw new Error('該電子郵件已被使用，請更換電子郵件。');
        } else {
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



//------------------會員登入------------------//

document.getElementById('loginBtn').addEventListener('click', async function (e) {
e.preventDefault(); // 阻止表單的默認提交行為

// 獲取電子信箱和密碼輸入框的值
const email = document.getElementById('login_email').value;
const password = document.getElementById('login_password').value;

// 構造要發送到後端的資料
const loginData = {
    email: email,
    password: password
};

try {
    // 發送 POST 請求到後端 API
    const response = await fetch('http://localhost:8080/TIA103G3_Servlet/MemberLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });
    credentials: 'include' // 包含 Cookie 以處理 Session

    // 檢查是否登錄成功
    if (response.ok) {
        const result = await response.json();
        if (result.success) {
            alert('登入成功');
            
            // 從 localStorage 獲取原來的頁面 URL
            const redirectUrl = localStorage.getItem('redirectUrl');
            
            // 清除保存的 URL 並重定向
            if (redirectUrl) {
                localStorage.removeItem('redirectUrl');
                window.location.href = redirectUrl;
            } else {
                // 如果沒有保存的 URL，重定向到預設的會員頁面
                window.location.href = 'my-frontpage.html';
            }
        } else {
            alert('登入失敗：' + result.message);
        }
    } else {
        alert('伺服器錯誤，請稍後再試。');
    }
} catch (error) {
    console.error('Fetch 錯誤:', error);
    alert('連接伺服器失敗，請檢查網路連線或稍後再試。');
}
});

//------------------會員登入------------------//

//------------------會員資料修改------------------//
document.addEventListener('DOMContentLoaded', function() {
    
    // 獲取會員資料並顯示在表單中
    fetch('http://localhost:8080/TIA103G3_Servlet/getOneMember', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('獲取會員資料失敗，請重新登入');
        }
        return response.json();
    })
    .then(data => {
        // 將會員資料顯示到 HTML 表單中
        document.getElementById('username').value = data.username;
        document.getElementById('check_email').value = data.email;
        document.getElementById('phone').value = data.phone;
        document.getElementById('check_address').value = data.address;
        document.getElementById('birthday').value = data.birthday;

        // 禁止修改生日，如果生日已經填寫
        if (data.birthday) {
            document.getElementById('birthday').disabled = true;
            document.getElementById('birthday').parentElement.insertAdjacentHTML('beforeend', '<p style="color: red;">提醒：生日只能填寫一次，無法再次修改。</p>');
        }
    })
    .catch(error => {
        console.error('錯誤:', error);
        window.location.href = 'login.html'; // 如果未登入則重定向到登入頁面
    });
});
//------------------會員資料修改------------------//


    // // 新增：顯示/隱藏密碼功能
    // function togglePassword(inputId) {
    //     const input = document.getElementById(inputId);
    //     input.type = input.type === 'password' ? 'text' : 'password';
    // }

    // // 新增：註冊表單提交驗證
    // document.getElementById('registerBtn').addEventListener('click', function () {
    //     const email = document.getElementById('register_email').value;
    //     const password = document.getElementById('register_password').value;
    //     const passwordConfirm = document.getElementById('password_comfirm').value;

    //     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailPattern.test(email)) {
    //         alert('請輸入有效的電子信箱地址');
    //         return;
    //     }

    //     if (password.length < 8) {
    //         alert('密碼必須至少包含 8 個字元');
    //         return;
    //     }

    //     if (password !== passwordConfirm) {
    //         alert('兩次輸入的密碼不一致');
    //         return;
    //     }

    //     document.getElementById('registerForm').submit();
    // });



