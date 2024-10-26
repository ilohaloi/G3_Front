export async function getMemberShip() {
    try {
        const response = await fetch('http://localhost:8081/JsFetchServlet/getMember', {
        method: "post",
        mode:"cors"
        })
        if (response.status === 200) {
            const prods = await response.json();
            return prods;
        }
    } catch(error) { 
        console.log(error);
    }
};

document.getElementById('registerBtn').addEventListener('click', async function(event) {
    event.preventDefault(); // 防止默認的表單提交

    // 獲取輸入框的值
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm_password').value.trim();

    // 簡單驗證
    if (!email || !password || !confirmPassword) {
        alert("所有欄位均為必填，請檢查！");
        return;
    }
    if (password !== confirmPassword) {
        alert("兩次輸入的密碼不一致，請重新檢查！");
        return;
    }

    // 組裝要發送的數據
    const data = {
        email: email,
        hashedPassword: password
    };

    try {
        // 使用 Fetch API 發送 POST 請求
        const response = await fetch('http://localhost:8080/TIA103G3_Servlet/MemberRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // 處理響應
        if (response.ok) {
            const result = await response.json();
            alert("註冊成功！" + (result.message ? result.message : ''));
        } else {
            const errorResult = await response.json();
            alert("註冊失敗：" + (errorResult.error ? errorResult.error : '未知錯誤'));
        }
    } catch (error) {
        console.error('發生錯誤:', error);
        alert("發生錯誤，請重試！");
    }
});
