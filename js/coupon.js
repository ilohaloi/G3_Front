// 假設用戶 ID 存在於 sessionStorage
const memb_id = sessionStorage.getItem('memb_id'); // 從 session 中獲取會員 ID

$.ajax({
    url: 'http://localhost:8081/TIA103G3_Servlet/getUserCoup', // 假設這是後端獲取優惠券的 URL
    method: 'POST',
    data: JSON.stringify({ memb_id }), // 傳遞動態會員 ID
    contentType: 'application/json',
    success: function (response) {
        // 處理優惠券數據
    },
    error: function (error) {
        console.error('無法取得優惠券：', error);
    }
});
