export const destination = {
    template:`
        <section class="space">
            <div class="container">
                <div class="row">
                    <div class="col-xxl col-lg">
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade active show" id="tab-grid" role="tabpanel" aria-labelledby="tab-destination-grid">
                                <div class="row gy-30">
                                    <!-- 在大屏幕上显示3列，每行3个 -->
                                    <div class="col-lg-4" v-for="(item, index) in route" :key="index">
                                        <div class="tour-box th-ani">
                                            <div class="tour-box_img global-img">
                                                <img :src="item.image" alt="image">
                                            </div>
                                            <div class="tour-content">
                                                <h3 class="box-title"><a href="#">{{item.name}}</a></h3>
                                                <h4 class="tour-box_price"><span class="currency">$ {{item.price}}</span> /人</h4>
                                                <div class="tour-action">
                                                    <span><i class="fa-light fa-clock"></i>{{item.days}}天</span>
                                                    <a href="#" @click="openDetail(item)" class="th-btn style4 th-icon">瀏覽行程</a>
                                                    <router-link to="/checkout" @click="process(item)">
                                                        <a href="#" class="th-btn style4 th-icon">訂購行程</a>
                                                    </router-link>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    data() {
        return {
            route:[]
        }
    },
    methods: {
        openDetail(route) {
            const params = new URLSearchParams({
                name: route.name,
                price: route.price,
                days: route.days,
                dep: encodeURIComponent(route.depiction)
            });
            window.open(
                `../component/travel_Detail.html?${params.toString()}`,
                '預覽',
                'width=600,height=600,left=200,top=100'
            );
        },
        process(item) {
            sessionStorage.setItem('travel', JSON.stringify({ name: item.name, prive:item.price,days:item.days,image:item.image}));
        }
    }  ,
    async mounted() {
        try {
            const response = await fetch('http://localhost:8081/TIA103G3_Servlet/route', {
            method: 'GET',
            mode:'cors'
            })
        if (response.status === 200) { 
            this.route = await response.json();
            console.log(this.route);
            
        }
        } catch (error) { 
            console.log('Error',error);
        }
    },
} 
export const checkout = {
    template: `
        <div class="th-checkout-wrapper space-top space-extra-bottom">
        <div class="container">
            <div class="woocommerce-form-coupon-toggle">
                <div class="woocommerce-info">優惠券<a href="#" class="showcoupon"></a></div>
            </div>
            <div class="row">
                <div class="col-12">
                    <form class="woocommerce-form-coupon">
                        <div class="form-group">
                            <label>優惠券密碼</label>
                            <select class="name" v-model="travel.coupon_id">
                                <option v-for="(item,index) in coupon" :key="index">{{item}}</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
            <form action="#" class="woocommerce-checkout mt-40">
                
            </form>
            <h4 class="mt-4 pt-lg-2">訂單</h4>
            <form action="#" class="woocommerce-cart-form">
                <table class="cart_table mb-20">
                    <thead>
                        <tr>
                            <th class="cart-col-image">圖片</th>
                            <th class="cart-col-productname">航線名稱</th>
                            <th class="cart-col-price">天數</th>
                            <th class="cart-col-total">總價</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="cart_item">
                            <td data-title="Product">
                                <img :src="travel.image" alt="Image" style="height: 91px; width: 120px; object-fit: cover;">
                            </td>
                            <td data-title="Name">
                                <p>{{travel.name}}</p>
                            </td>
                            <td data-title="Price">
                                <span class="amount">{{travel.days}}天</span>
                            </td>
                            <td data-title="Quantity">
                                <span class="product-quantity"><bdi><span>$</span>{{travel.prive}}</bdi></span>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot class="checkout-ordertable">
                    </tfoot>
                </table>
            </form>

            <div>
                <h2 class="h4">基本資料</h2>
                <div class="row">
                    <div class="col-lg-6 form-group has-label">
                        <label>姓名</label>
                        <input type="text" class="form-control" v-model="memb.name" readonly>
                    </div>
                    <div class="col-lg-6 form-group has-label">
                        <label>住址</label>
                        <input type="text" class="form-control"  v-model="memb.shipaddr" readonly>
                    </div>
                    <div class="col-lg-6 form-group has-label">
                        <label>信箱</label>
                        <input type="email" class="form-control" v-model="memb.email" readonly>
                    </div>
                    <div class="col-lg-6 form-group has-label">
                        <label>電話</label>
                        <input type="text" class="form-control" v-model="memb.phone" readonly>
                    </div>
                    <div class="col-lg-6 form-group has-label">
                        <label for="roomType">房間類型:</label>
                        <select v-model="order.room_type" required>
                            <option value="">-- 請選擇 --</option>
                            <option value="單人房">單人房</option>
                            <option value="雙人房">雙人房</option>
                        </select>
                    </div>
                    <div class="col-lg-6 form-group has-label">
                        <label for="roomType">房間數量</label>
                        <input type="number" v-model="order.room_amount" min="0" max="99">
                    </div>
                </div>
            </div>
            <div class="mt-lg-3 mb-30">
                <div class="woocommerce-checkout-payment">
                    <ul class="wc_payment_methods payment_methods methods">
                        <li class="wc_payment_method payment_method_cod">
                            <input id="payment_method_cod" type="radio" class="input-radio">
                            <label for="payment_method_cod">Credit Cart</label>
                        </li>
                    </ul>
                    <div class="form-row place-order" style="margin-left: 40px;">
                        <button @click="submit" class="th-btn">下訂</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            //Test
            memb: {
                id: 1,
                name: "測試",
                shipaddr: "123",
                email: "google",
                phone: "0123456789"
            },
            order: {
                memb_id: 1,
                ship_id: 1,
                coupon_id: null,
                trav_orde_status: "未付款",
                room_type:"",
                room_amount: 0,
                trave_orde_amount:0
            },
            coupon:[],
            travel: {
                
            }
            
        }
    },
    methods: {
        async submit() {
            //TODO 
            try {
                const response = await fetch('http://localhost:8081/TIA103G3_Servlet/inserttravel_orderfetchservlet', {
                    method: "POST",
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.order)
                })
                if (response.status === 200)
                    thit.$router.push('order');


            } catch (error) {
                
            }
        }
    },
    async mounted() { 

        // try {
        //     const response = await fetch(`http://localhost:8081/TIA103G3_Servlet/CouponsOwned?${memb.id}`, {
        //         method: 'GET',
        //         mode: 'cors',
        //     })
        // if (response.status === 200) { 
        //     this.coupon = await response.json();
        // }
        // } catch (error) { 
        //     console.log('Error',error);
        // }

        this.travel = await JSON.parse(sessionStorage.getItem('travel'));
        console.log(this.travel);
        
    }
}
export const order = {
    template:`
    <section class="space">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="th-account-form">
                        <h2>報名成功！</h2>
                        <p>感謝您提交報名資料，我們已收到您的申請。</p>
                        <p>感謝您的報名，我們期待與您展開愉快的航程！</p>
                        <a href="index.html">
                            <button class="th-btn">返回首頁</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `,
}
