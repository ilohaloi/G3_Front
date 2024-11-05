//------------------會員登入------------------//

// 綁定登入按鈕的點擊事件
// 當使用者點擊登入按鈕時觸發這個函數


document.getElementById('loginBtn').addEventListener('click', async function (e) {
    e.preventDefault(); // 阻止表單的默認提交行為
    
    
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    // 構造要發送到後端的資料
    const loginData = {
        email: email,
        password: password
    };
    try {
        // 發送 POST 請求到後端 API
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/MemberLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        // 檢查是否登錄成功
        if (response.status === 200) {
        
            const email = await response.json();
            sessionStorage.setItem("id", email.id);
            window.location.reload();
            //window.location.replace("../destination.html#/checkout");
        
        } else if(response.status === 401){
            alert('登入失敗，請先註冊帳號');
        }
    } catch (error) {
        console.error("發生錯誤：", error);
        alert("伺服器無回應，請稍後再試。");
    }
});
//------------------會員登入------------------//


// 會員中心跳轉
document.getElementById('memberHomePage').addEventListener('click', function (){
    if (sessionStorage.getItem('id')) {
        window.location.replace('../membHomePage.html');
    }
});


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
    //     document.getElementById('registerForm').submit();
    // });

