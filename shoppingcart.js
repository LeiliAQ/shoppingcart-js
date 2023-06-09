let allProducts= [
    {id:1, title:'T-Shirt', price:10 ,img:'images/tshirt.jfif',count:1},
    {id:2, title:'Skirt', price:10 ,img:'images/skirt.jpg',count:1},
    {id:3, title:'Shoes', price:10 ,img:'images/shoes.jfif',count:1},
    {id:4, title:'dress', price:10 ,img:'images/dress.webp',count:1},
    {id:5, title:'top', price:10 ,img:'images/top.webp',count:1},
    {id:6, title:'gloves', price:10 ,img:'images/gloves.jfif',count:1},
    {id:7, title:'scraf', price:10 ,img:'images/scarf.jfif',count:1},
    {id:8, title:'pants', price:10 ,img:'images/pants.jfif',count:1},
];
const $=document;
const productsElem= $.querySelector('.products');
// const addtoCartBtns= $.querySelectorAll('.add');
const basketElem= $.querySelector('.cart');
const purchaseElem=$.querySelector('.purchase');
const totalpriceElem= $.querySelector('.total-price');
//  basket icon
const basketiconElem= $.querySelector('.basketicon');
const basketincludesElem= $.querySelector('.basketincludes');
// documentfragment
const productsFragment= $.createDocumentFragment();
// 
let continueBtnElem= $.querySelector('.continue');
// local storage array
let  localStorageArray=[];
function addProducts(){
    allProducts.forEach(addaProduct);
}
function addaProduct(product){
    // create list of products// if Add To Cart button clicked// refactor by insertAdjacentHTML
    // productsElem.insertAdjacentHTML('beforeend','<div class="product"><h1>'+product.title +'</h1><img src="'+product.img+'"><div class="lastrow"><p class="price">'+product.price+'</p><button class="add" onclick="addRowToBasket('+product.id+')">Add To Cart</button></div></div>')
    let newProductTitle= $.createElement('h1') ;
    newProductTitle.innerHTML= product.title;
    let newProductimg= $.createElement('img');
    newProductimg.src=product.img;
    let newProductPrice= $.createElement('p');
    newProductPrice.innerText=product.price+'$';
    newProductPrice.classList.add('price');
    let newdivElem= $.createElement('div') ;
    newdivElem.classList.add('lastrow');
    let newAddbtn= $.createElement('button');
    newAddbtn.innerText='Add To Cart';
    newAddbtn.classList.add('add');
    let newProductdiv= $.createElement('div') ;
    newProductdiv.classList.add('product');
    // create more information link    
    let moreINFOLink= $.createElement('a');
    moreINFOLink.innerText='More Information';
    moreINFOLink.classList.add('more-info');
    moreINFOLink.href="product.html"+"?id="+product.id;
    // appendChild
    newdivElem.appendChild(newProductPrice);
    newdivElem.appendChild(newAddbtn);
    // append more information link
    newdivElem.appendChild(moreINFOLink);
    newProductdiv.appendChild(newProductTitle);
    newProductdiv.appendChild(newProductimg);
    newProductdiv.appendChild(newdivElem);
    productsFragment.appendChild(newProductdiv);
    // if Add To Cart button clicked
    newAddbtn.addEventListener('click',function(){
        addRowToBasket(product.id);
    });
    productsElem.appendChild(productsFragment);
}
// when Add To Cart btn is clicked
function addRowToBasket(productID){
    let basketItems = JSON.parse(localStorage.getItem('productslocalstorage')) || [];
    let product= allProducts.find(function(item){
        return item.id=== productID;
        })
    // Not add repetitive item to basket
    let alreadyInBasket= basketItems.find(function(itemInBasket){
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
        else{
            addnonRepetitiveItemtoBasket(product); 
            calculateTotalPrice();
        }  
}
function addnonRepetitiveItemtoBasket(product){
    // to prevent adding repetitive items to localStorage
    // if this function has not called by displayBasket function afre window loading
    if(!loadWindow){
        let basketItems = JSON.parse(localStorage.getItem('productslocalstorage')) || []; 
        basketItems.push(product);
        setLocalStorage(basketItems);
    }
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
    // updateproductCount(product.id,1);   
}
function removefromBasket(productID,basketItem){
    let basketItems = JSON.parse(localStorage.getItem('productslocalstorage')) || [];
    let index= basketItems.findIndex(function(item){
        return item.id===productID;
    })
    basketItems.splice(index,1);
    localStorageArray.splice(index,1);
    setLocalStorage(basketItems);
    basketItem.remove();
}
function updateproductCount(productID,newValue){
    // console.log('productid:'+productID+ 'count:'+newValue);
    let basketItems = JSON.parse(localStorage.getItem('productslocalstorage')) || [];
    let index= basketItems.findIndex(function(item){
        return item.id=== productID;
    })
    // console.log(index);
    basketItems[index].count= Number(newValue);
    setLocalStorage(basketItems);
    calculateTotalPrice();
}
// calculate total price and show it in totalpriceElem tag
function calculateTotalPrice(){
    let basketItems = JSON.parse(localStorage.getItem('productslocalstorage')) || [];
    let total=0;
    let totalCounts=0;
    basketItems.forEach(function(item){
        total+= item.price*item.count;
        totalCounts= item.count+totalCounts;
    })
    totalpriceElem.innerHTML=  total+'$';  
    basketincludesElem.innerHTML= totalCounts; 
}
// add a row to the basket and return its remove button and complete ul(row in basket)
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
    let basketItems = JSON.parse(localStorage.getItem('productslocalstorage')) || [];
    inputElement.addEventListener('change',function(){
        // find the product that its count changed= changedCountProduct
        let changedCountProduct= basketItems.find(function(pr){
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
    // scroll page to the top
    window.scrollTo(0,0);
    // change focus to purchase button
    purchaseElem.focus();
    // enable/disable add buttons when modal is shown
    const allAddBtns= $.querySelectorAll('.add');
    allAddBtns.forEach(function(Btn){
        if(Btn.disabled===true){
            Btn.removeAttribute('disabled');
            // show cursor(pointer) for add btns
            Btn.style.cursor='pointer';
        }
        else {
            Btn.setAttribute('disabled','');
            // hide cursor for add btns
            Btn.style.cursor='none';
        }
    })   
}
continueBtnElem.addEventListener('click',basketHandler);

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
        // userBasket=[];
        setLocalStorage([]);
    } 
    else{
        basketHandler();
        // userBasket=[];
        setLocalStorage([]);
    }  
    allProducts.forEach(function(item){
        item.count=1;
    })
})
// set local storage 
function setLocalStorage(basket){
    localStorage.setItem('productslocalstorage',JSON.stringify(basket));
}
// addnonRepetitiveItemtoBasket function call from here
loadWindow=false;
function displayBasket(){
    let basketItems = JSON.parse(localStorage.getItem('productslocalstorage')) || [];
    if(basketItems.length>0){
        loadWindow=true;
        basketItems.forEach(function(product){
            addnonRepetitiveItemtoBasket(product);
            calculateTotalPrice();
        })
        loadWindow=false;
    }      
}
// add all products to page
addProducts();
// display basket it may be empty or get data from localStorage
displayBasket();



