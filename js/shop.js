export async function getProducts() {

    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/prodget', {
        method: 'post',
        headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:'getAllprod'})
        })
        if (response.status === 200) { 
            return response.json();
        }
    } catch (error) { 
        console.log('Error',error);
    }
};
export async function getProduct(id) {

    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/prodget', {
        method: 'post',
        headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:'getProd',identity:id})
        })
        if (response.status === 200) { 
            return response.json();
        }
    } catch (error) { 
        console.log('Error',error);
    }
};
export function addTocart(item,qty,action) { 
    const prod = {
        id:item.id,
        name: item.name,
        price: item.price,
        qty:qty,
        imgs: item.img1
    }

    if (!localStorage.getItem('cart')) { 
        localStorage.setItem('cart',JSON.stringify([prod]));
    } else {
        updateCart(prod,action)
    }
}
export function updateCart(item,action) { 
    let  cart  = JSON.parse(localStorage.getItem('cart'));
    let exitisItem;
    switch (action) { 
        case 'Increase':
            exitisItem = cart.find(obj => obj.id === item.id);
            if (exitisItem)
                exitisItem.qty = item.qty;
            else
                cart.push(item);
            break;
        //prod_view 用
        case 'existIncrease':
            exitisItem = cart.find(obj => obj.id === item.id);
            if (exitisItem)
                exitisItem.qty += item.qty;
            else
                cart.push(item);
            break;
        case 'remove':
            cart = cart.filter(function (obj) {
                return obj.id !== item.id;
            });
            break;
    }
    localStorage.setItem('cart',JSON.stringify(cart)); 
}
export function totalUpdate(cart) { 
    let total = cart.reduce((sum, obj) => sum + obj.qty * obj.price, 0);
    return total;
}
export async function insertOrder(data) { 
    try {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const response = fetch('http://localhost:8081/TIA103G3_Servlet/insertorder', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data:data,prod:cart})
        })
        // if (response.status === 200) { 
        //     this.$router.push('/ordercomplete')
        // } else {
            
        // }
    } catch (error) { 

    }
}