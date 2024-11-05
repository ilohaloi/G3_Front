// 假設用戶 ID 存在於 sessionStorage
const memb_id = sessionStorage.getItem('id'); // 從 session 中獲取會員 ID
console.log("會員 ID:", memb_id);

$.ajax({
    url: `http://localhost:8081/TIA103G3_Servlet/CouponsOwned?memberId=${memb_id}`, // 將 memberId 添加到 URL 中
    method: 'GET', // 使用 GET 方法
    dataType: 'json', // 指定期望的數據格式
    success: function (coupons) {
        console.log("獲取的優惠券資料:", coupons); // 檢查回傳數據

        // 根據 is_used 值將優惠券分類
        const usableCoupons = [];
        const usedCoupons = [];
        const expiredCoupons = [];

        coupons.forEach(function (coupon) {
            if (coupon.coup_is_used === 0) {
                usableCoupons.push(coupon);
            } else if (coupon.coup_is_used === 1) {
                usedCoupons.push(coupon);
            } else if (coupon.coup_is_used === 2) {
                expiredCoupons.push(coupon);
            }
        });

        // 顯示分類後的優惠券
        displayCoupons(usableCoupons, usedCoupons, expiredCoupons);
    },
    error: function (status, error) {
        console.error('無法取得優惠券：', status, error);
    }
});

// 顯示優惠券的函數，假設有元素 #usableCoupons、#usedCoupons 和 #expiredCoupons
function displayCoupons(usable, used, expired) {
    console.log("可使用的優惠券:", usable);
    console.log("已使用的優惠券:", used);
    console.log("已過期的優惠券:", expired);

    // 顯示可使用的優惠券
    if (usable.length > 0) {
        $("#usableCoupons").html(usable.map(coupon => `<div>${coupon.name} - 到期日: ${coupon.expiry_date}</div>`).join(''));
        $("#usableCoupons").show(); // 顯示可使用的區域
        $(".no-coupons").hide(); // 隱藏沒有優惠券的消息
    } else {
        $("#usableCoupons").html('<p>目前沒有可使用的優惠券。</p>');
        $("#usableCoupons").show(); // 仍然顯示可使用的區域
        $(".no-coupons").show(); // 顯示沒有優惠券的消息
    }

    // 顯示已使用的優惠券
    if (used.length > 0) {
        $("#usedCoupons").html(used.map(coupon => `<div>${coupon.name} - 到期日: ${coupon.coup_expiry_date}</div>`).join(''));
        $("#usedCoupons").show(); // 顯示已使用的區域
    } else {
        $("#usedCoupons").html('<p>目前沒有已使用的優惠券。</p>');
        $("#usedCoupons").show(); // 仍然顯示已使用的區域
    }

    // 顯示已過期的優惠券
    if (expired.length > 0) {
        $("#expiredCoupons").html(expired.map(coupon => `<div>${coupon.name} - 到期日: ${coupon.expiry_date}</div>`).join(''));
        $("#expiredCoupons").show(); // 顯示已過期的區域
    } else {
        $("#expiredCoupons").html('<p>目前沒有已過期的優惠券。</p>');
        $("#expiredCoupons").show(); // 仍然顯示已過期的區域
    }

    // 初始隱藏其他區域
    $("#usedCoupons").hide(); // 隱藏已使用的區域
    $("#expiredCoupons").hide(); // 隱藏已過期的區域
}


function showCoupons(type) {
    // 隱藏所有優惠券類別
    $(".coupon-list").hide();

    // 顯示選擇的優惠券類別
    if (type === 'usable') {
        $("#usableCoupons").show();
    } else if (type === 'used') {
        $("#usedCoupons").show();
    } else if (type === 'expired') {
        $("#expiredCoupons").show();
    }

    // 移除所有標籤的 `active` 類別
    $(".discount-tab li").removeClass("active");

    // 添加 `active` 類別到當前點擊的標籤
    if (type === 'usable') {
        $(".discount-tab li:nth-child(1)").addClass("active");
    } else if (type === 'used') {
        $(".discount-tab li:nth-child(2)").addClass("active");
    } else if (type === 'expired') {
        $(".discount-tab li:nth-child(3)").addClass("active");
    }
}
