const form = document.getElementById("loginForm");

form.addEventListener('submit', e =>{
    e.preventDefault();

    const data = new FormData(form);

    const obj = {};

    data.forEach((value,key) => obj[key]=value)
    fetch('/api/session/login',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result=>{
        if(!result.error){
            window.location.replace('/products')
        }else{
            alert(result.error)
        }
    }).catch((error)=>{
        alert(error)
    })
})