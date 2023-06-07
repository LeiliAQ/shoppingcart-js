let allProducts= [
    {id:1, title:'T-Shirt', price:10 ,img:'images/tshirt.jfif',count:1},
    {id:2, title:'Skirt', price:10 ,img:'images/skirt.jpg',count:1},
    {id:3, title:'Shoes', price:10 ,img:'images/shoes.jfif',count:1},
    {id:4, title:'dress', price:10 ,img:'images/dress.webp',count:1},
];
let userBasket=[];
const $=document;
const productsElem= $.querySelector('.products');
// const addtoCartBtns= $.querySelectorAll('.add');
const basketElem= $.querySelector('.cart');
const purchaseElem=$.querySelector('.purchase');
const totalpriceElem= $.querySelector('.total-price');
//  basket icon
const basketiconElem= $.querySelector('.basketicon');
const basketincludesElem= $.querySelector('.basketincludes');

// 
function addProducts(){
    allProducts.forEach(addaProduct);
}
function addaProduct(product){
    // create list of products// if Add To Cart button clicked// refactor by insertAdjacentHTML
    productsElem.insertAdjacentHTML('beforeend','<div class="product"><h1>'+product.title +'</h1><img src="'+product.img+'"><div class="lastrow"><p class="price">'+product.price+'</p><button class="add" onclick="addRowToBasket('+product.id+')">Add To Cart</button></div></div>')
}
// add all products to page
addProducts();
// when Add To Cart btn is clicked
function addRowToBasket(productID){
    let product= allProducts.find(function(item){
        return item.id=== productID;
        })
    // Not add repetitive item to basket
    let alreadyInBasket= userBasket.find(function(itemInBasket){
        return itemInBasket.title=== product.title;
        })
     //  if item is repititive, its count in basket will increases 1
     if(alreadyInBasket){
        let countInputs= $.querySelectorAll('.change-count');
        countInputs.forEach(function(item){
            if(item.dataset.title===alreadyInBasket.title){
                item.value=Number(item.value)+1;
                // console.log(item.value);
                updateproductCount(productID,alreadyInBasket.count+1);
            }
        })    
    } 
    // this item is not repitive and can be added to basket
    addRepetitiveItemtoBasket(product,alreadyInBasket); 
}
function addRepetitiveItemtoBasket(product,alreadyInBasket){
    if(!alreadyInBasket){
        userBasket.push(product);
        // create a row in shopping cart and mremove btn(returnbuttonEle) and basketItem and inputElem
        let newArray= addARowToCart(product);
        let buttonElem=newArray[0]; //remove btn
        let basketItem=newArray[1]; // ul containing the added product
        // if remove button(buttonElem) clicked
        buttonElem.addEventListener('click',function(){
            updateproductCount(product.id,0);
            removefromBasket(product.id,basketItem);  
        })
        //  check if the count of product(inputElement) changed
        let inputElems= $.querySelectorAll('.change-count');
        inputElems.forEach(function(inputElement){
            changeCountofproductInBasket(inputElement);
        })
        // when a new row added
        updateproductCount(product.id,1);   
    }    
}
function removefromBasket(productID,basketItem){
    let index= userBasket.findIndex(function(item){
        return item.id===productID;
    })
    userBasket.splice(index,1);
    basketItem.remove();
}
function updateproductCount(productID,newValue){
    // console.log('productid:'+productID+ 'count:'+newValue);
    let index= userBasket.findIndex(function(item){
        return item.id=== productID;
    })
    userBasket[index].count= Number(newValue);
    calculateTotalPrice();
}
// calculate total price and show it in totalpriceElem tag
function calculateTotalPrice(){
    let total=0;
    let totalCounts=0;
    userBasket.forEach(function(item){
        total+= item.price*item.count;
        totalCounts= item.count+totalCounts;
    })
    totalpriceElem.innerHTML=  total+'$';  
    basketincludesElem.innerHTML= totalCounts; 
}
// add a row to the basket
function addARowToCart(product){
        basketElem.insertAdjacentHTML('beforeend','<ul class="basket-item"><li><img src="'+product.img +'"><span>'+product.title +'</span></li><li class="basket-price">'+product.price +'</li><li><input type="number" class="change-count" min="0" data-title="'+product.title +'" value="'+product.count +'"><button class="remove">REMOVE</button></li></ul>');
        const buttonElems= $.querySelectorAll('.remove');
        let buttonElem= buttonElems[buttonElems.length-1];
        const basketItems= $.querySelectorAll('.basket-item');
        let basketItem= basketItems[basketItems.length-1];
        return [buttonElem,basketItem];       
}
// codes will run if count of the item in basket has changed
function changeCountofproductInBasket(inputElement){
    inputElement.addEventListener('change',function(){
        let changedCountProduct= userBasket.find(function(pr){
            return pr.title=== inputElement.dataset.title ;  
        })
        console.log(changedCountProduct);
        if(inputElement.value==0){
            // product from userBasket and item from DOM should be removed
            let shoulBeRemovedItem= inputElement.parentElement.parentElement; // ul.basket-item 
            updateproductCount(changedCountProduct.id,0);
            removefromBasket(changedCountProduct.id,shoulBeRemovedItem); 
        }
        else{
            updateproductCount(changedCountProduct.id,inputElement.value);
        }
    })
}
// click on basket icon, display modal
basketiconElem.addEventListener('click',basketHandler);
function basketHandler(){
    let modalElem= $.querySelector('.modal');
    modalElem.classList.toggle('show');
    productsElem.classList.toggle('filter');
}
// purchase button
purchaseElem.addEventListener('click',function(){
    let basketitemElems= $.querySelectorAll('.basket-item');
    basketitemElems.forEach(function(basketItem){
        basketItem.remove();
    })
    if(totalpriceElem.innerHTML!=='0$'){
        window.alert('Are you sure?');
        basketincludesElem.innerHTML= 0;
        totalpriceElem.innerHTML= 0;
        basketHandler();
        userBasket=[];
    } 
    else{
        basketHandler();
        userBasket=[];
    }  
    allProducts.forEach(function(item){
        item.count=1;
    })
})