
function addProduct(idProduct,cartId) {
  console.log(cartId)
    // JavaScript code here
    axios.post(`/api/carts/${cartId}/product/${idProduct}`)
      .then(response => {
        window.location.href = `/carts/${cartId}`;
      })
      .catch(error => {
        // Handle errors
        alert(error.request.response)
        console.error(error.request.respose);
        window.location.href = `/api/session/logout`;
      });
  }
function checkScriptLoad() {
    console.log('Script loaded successfully.');
    // Perform additional validation or actions
  }