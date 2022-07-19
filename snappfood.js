cookies = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')));
let UDID = cookies.UDID;
let jwt = cookies[['jwt-access_token']];
// let jwt = JSON.parse(window.localStorage.JWT).access_token;

var myHeaders = new Headers();
myHeaders.append("authority", "snappfood.ir");
myHeaders.append("accept", "application/json, text/plain, */*");
myHeaders.append("accept-language", "en-US,en;q=0.9,fa;q=0.8");
myHeaders.append("authorization", "Bearer " + jwt);
myHeaders.append("content-type", "application/x-www-form-urlencoded");
myHeaders.append("referer", "https://snappfood.ir/profile/orders");
myHeaders.append("sec-ch-ua", "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"");
myHeaders.append("sec-ch-ua-mobile", "?1");
myHeaders.append("sec-ch-ua-platform", "\"Android\"");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "same-origin");
myHeaders.append("user-agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36");
let sortMostOrder=( a, b )=> {
  if ( a.no > b.no )
    return -1;
  if ( a.no < b.no )
    return 1;
  return 0;
}
let sortPriceMostOrder=( a, b )=> {
  if ( a.totalPrice > b.totalPrice )
    return -1;
  if ( a.totalPrice < b.totalPrice )
    return 1;
  return 0;
}
const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

let response = await fetch(`https://snappfood.ir/mobile/v1/order/reorder?optionalClient=WEBSITE&client=WEBSITE&deviceType=WEBSITE&appVersion=8.1.1&UDID=${UDID}&page=0&size=5000&locale=fa`, requestOptions);
const content = (await response.json()).data.orders;

let price = 0;
let bestCount = 0;

let cat=[{no:0,cat:"",id:"",title:"",totalPrice:-1}]
let discount = 0;
for (let i = 0; i < content.length; i++) {
    let order = content[i];
    if (!order.orderCanceled) {
        let isItem = false;
        let tempCat=cat.map(item=>{
            if(item.id === order.vendorId){
		
            isItem=true;
            let tempNo = item['no']+1;
	    let tempTotalPrice = item['totalPrice']+order['totalPrice'];
               return {no:tempNo,cat:item.cat,id:item.id,title:item.title,totalPrice:tempTotalPrice};
            }
            else{
               return item;
            }
        })
        if(!isItem){
            tempCat.push({no:1,cat:order.newType,id:order.vendorId,title:order.vendorTitle,totalPrice:order['totalPrice']});
        }
	cat=[];
        cat=tempCat;
        price += order['totalPrice'];
        discount += order['sumAllDiscount'];
    }
}

let newCat = cat.slice().sort(sortMostOrder);
let perPrice = cat.slice().sort(sortPriceMostOrder);
let itemNoToShow = 3;
let tempItem = itemNoToShow;
for(most of newCat){
	if(tempItem > 0) console.log("Most Ordered food from: ",most.title,"		Category: ",most.cat,"	Order Times: ",most.no);
	else {
		tempItem = itemNoToShow;
		break;
	}
	tempItem--;
}
for(most of perPrice){
	if(itemNoToShow > 0) console.log("Most Ordered food per Price: ",most.title,"		Category: ",most.cat,"	Total Price: ",most.totalPrice+" Toman");
	else {
		tempItem = itemNoToShow;
		break;
	}
	tempItem--;
}


console.log(`Total order: ${content.length}`)
console.log(`Total spent: ${price.toLocaleString()}`);
console.log(`Total discount: ${discount.toLocaleString()}`);
console.log(`Oldest order date: ${content.at(-1).startedAt}`);
