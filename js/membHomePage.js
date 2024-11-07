

export const homePage = {
    template:`
    <div class="team">
        <div class="">
            <div class="row justify-content-center space-top">

                    <div class="col-4" style="
                        width:800px;
                    ">
                        <div class="boardTitle">
                            <span class="boardTitle--bold">訂單查詢</span>
                            <div class="emoneyButtons">
                                <a href="#" class="paleGrayLink"><span >明細查詢</span></a>
                            </div>
                        </div>

                        <table>    
                                <thead class="container text-center">
                                    <tr class="row">
                                        <td class="col text-start">訂單編號</td>
                                        <td class="col text-start">訂單日期</td>
                                        <td class="col text-start">金額</td>
                                    </tr>
                                </thead>
                                <tbody class="container text-center">
                                    <tr v-for="(item,index) in order" :key=index class="row">
                                        <td class="col text-start">{{item.id}}</td>
                                        <td class="col text-start">{{item.id}}</td>
                                        <td class="col text-start">{{item.id}}</td>
                                    </tr>
                                </tbody>
                        </table>
                        <div v-if="isOrderEmpty">
                            <div class="boardCnt">
                                <div class="loadingPic"></div>
                            </div>
                        </div>
                        
                    </div>

                    <!-- 折扣碼和行程收藏 並排顯示 -->
                    <div class="col-4" style="
                        width:800px;
                    ">
                        <div class="boardTitle">
                            <span class="boardTitle--bold">折扣碼</span>
                            <a class="rightLink paleGrayLink" href="#"><span>前往列表</span></a>
                        </div>
                        
                        <table>
                            <thead class="container text-center">
                                <tr class="row">
                                    <td class="col text-start">名稱</td>
                                    <td class="col text-start">折扣(％)</td>
                                    <td class="col text-start">到期日</td>
                                </tr>
                            </thead>
                                <tbody class="container text-center">
                                    <tr v-for="(item, index) in coupon.slice(0, 5)" :key="index" class="row">
                                        <td class="col text-start">{{ item.coupName.length > 10 ? item.coupName.slice(0, 25) + '...' : item.coupName }}</td>
                                        <td class="col text-start">{{ item.discount }}</td>
                                        <td class="col text-start">{{ item.expiryDate }}</td>
                                    </tr>
                                </tbody>
                        </table>

                        <div v-if="isCouponEmpty">
                            <div class="boardCnt">
                                <div class="loadingPic"></div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            order: [],
            coupon:[],
        }
    },
    methods: {
        
    },
    computed: {
        isOrderEmpty() { 
            return this.order.length===0;
        },
        isCouponEmpty() { 
            return this.coupon.length===0;
        }
    },
    async mounted() {
        try {
            const memberId = `membId=${sessionStorage.getItem('id')}`;


            const respOrder = await fetch(`http://localhost:8081/TIA103G3_Servlet/getOrder?${memberId}`, {
                method: "get",
                mode:"cors"
            })
            if (respOrder.status == 200) {

                this.order = await respOrder.json();
                console.log(this.order);
            }
            const respCoupon = await fetch(`http://localhost:8081/TIA103G3_Servlet/CouponsOwned?action=member&${memberId}`, {
                method: "GET",
                mode:"cors"
            })
            if (respCoupon.status == 200) {

                this.coupon = await respCoupon.json();
                console.log(this.coupon);
            }

        } catch (error) {
            console.log(error);
            
        }
    },
}
export const information = {
    template:`
        <h3>555</h3>
    `
}