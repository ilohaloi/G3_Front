    //----------------會員資料修改----------------//
    // 當 DOM 完全加載後執行
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

    // 表單提交時的處理
    const memberForm = document.getElementById('memberUpdateForm');
    memberForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // 從表單中取得輸入的資料
        const updatedMemberData = {
            name: document.getElementById('username').value,
            tell: document.getElementById('check_tell').value,
            address: document.getElementById('check_address').value,
            birthday: document.getElementById('check_birthday').value,
            password: document.getElementById('check_password').value,
            password_confirm: document.getElementById('check_password_confirm').value
        };
        console.log("123");

        // 簡單驗證：確認密碼是否一致
        if (updatedMemberData.password !== updatedMemberData.password_confirm) {
            alert('密碼與確認密碼不相符，請重新輸入。');
            return;
        }

        // 使用 Fetch API 發送 POST 請求給後端進行會員資料修改
        fetch('http://localhost:8080/TIA103G3_Servlet/updateMember', {
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
            if (data.success) {
                alert('會員資料更新成功');
                if (updatedMemberData.password) { // 如果使用者有更新密碼
                    alert('請重新登入以驗證您的新密碼。');
                    window.location.href = 'my-account.html'; // 跳轉至登入頁面
                }
            } else {
                alert('會員資料更新失敗，請重試'); // 如果更新失敗，顯示失敗提示
            }
        })
        .catch(error => {
            console.error('無法更新會員資料', error); // 打印錯誤訊息到控制台，並且顯示詳細錯誤
            alert('更新會員資料時發生錯誤，請稍後再試'); // 顯示錯誤提示給用戶
        });
    });

});

 //----------------會員資料修改----------------//
