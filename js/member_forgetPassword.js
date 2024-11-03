document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const email = document.getElementById('resetPW_email').value;

    if (!email) {
        alert('請輸入電子信箱');
        return;
    }

    fetch('http://localhost:8081/TIA103G3_Servlet/MemberForgetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('已發送重設密碼的郵件，請檢查您的收件匣');
            console.log("已傳送");
        } else {
            alert(data.message);
            console.log("信箱未註冊或其他錯誤: " + data.message);
        }
    })
    .catch(error => {
        console.error('錯誤:', error);
        alert('系統錯誤，請稍後再試');
    });
});