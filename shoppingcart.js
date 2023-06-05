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
    let newProductTitle= $.createElement('h1') ;
    newProductTitle.innerHTML= product.title;
    let newProductimg= $.createElement('img');
    newProductimg.src=product.img;
    let newProductPrice= $.createElement('p');
    newProductPrice.innerText=product.price;
    newProductPrice.classList.add('price');
    let newdivElem= $.createElement('div') ;
    newdivElem.classList.add('lastrow');
    let newAddbtn= $.createElement('button');
    newAddbtn.innerText='Add To Cart';
    newAddbtn.classList.add('add');
    let newProductdiv= $.createElement('div') ;
    newProductdiv.classList.add('product');
    // appendChild
    newdivElem.appendChild(newProductPrice);
    newdivElem.appendChild(newAddbtn);
    newProductdiv.appendChild(newProductTitle);
    newProductdiv.appendChild(newProductimg);
    newProductdiv.appendChild(newdivElem);
    productsElem.appendChild(newProductdiv);
    // if Add To Cart button clicked
    newAddbtn.addEventListener('click',function(){
        addRowToBasket(product.id);
    });
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
    if(!alreadyInBasket){
        userBasket.push(product);
        // create a row in shopping cart and mremove btn(returnbuttonEle) and basketItem and inputElem
        let newArray= addARowToCart(product);
        let buttonElem=newArray[0]; //remove btn
        let basketItem=newArray[1]; // ul containing the added product
        let inputElem= newArray[2]; //input element for count 
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
        updateproductCount(product.id,inputElem.value);   
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
        let basketItem= $.createElement('ul');
        basketItem.classList.add('basket-item');
        let firstliElem= $.createElement('li');
        let imgElem= $.createElement('img');
        imgElem.src=product.img;
        let spanElem= $.createElement('span');
        spanElem.innerHTML= product.title;
        firstliElem.appendChild(imgElem);
        firstliElem.appendChild(spanElem);
        let secondliElem= $.createElement('li');
        secondliElem.classList.add('basket-price');
        secondliElem.innerHTML=product.price  ;
        thirdliElem= $.createElement('li');
        inputElem= $.createElement('input');
        inputElem.setAttribute('type','number');
        inputElem.classList.add('change-count');
        inputElem.setAttribute('min','0');
        inputElem.setAttribute('data-title',product.title);
        inputElem.value=product.count;
        buttonElem= $.createElement('button');
        buttonElem.classList.add('remove');
        buttonElem.innerHTML='REMOVE';
        thirdliElem.appendChild(inputElem);
        thirdliElem.appendChild(buttonElem);
        basketItem.appendChild(firstliElem);
        basketItem.appendChild(secondliElem);
        basketItem.appendChild(thirdliElem);
        basketElem.appendChild(basketItem);
        return [buttonElem,basketItem,inputElem];
}
// codes will run if count of the item in basket has changed
function changeCountofproductInBasket(inputElement){
    inputElement.addEventListener('change',function(){
        let changedCountProduct= userBasket.find(function(pr){
            return pr.title=== inputElement.dataset.title ;  
        })
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
    userBasket=[];
    let basketitemElems= $.querySelectorAll('.basket-item');
    basketitemElems.forEach(function(basketItem){
        basketItem.remove();
    })
    if(totalpriceElem.innerHTML!=='0$'){
        window.alert('Are you sure?');
        basketincludesElem.innerHTML= 0;
        totalpriceElem.innerHTML= 0;
        basketHandler();
    } 
    else{
        basketHandler();
    }  
})