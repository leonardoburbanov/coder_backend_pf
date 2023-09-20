$(document).ready(function(){
    $('#table_users').DataTable();
})

function updateRol(userId) {
    console.log("Llega aquí");
    // JavaScript code here
    axios.put(`/api/users/premium/${userId}`)
      .then(response => {
        location.reload()
      })
      .catch(error => {
        alert(error.response.data.error)
        console.log(error.response.data.error);
      });
}
 
function checkScriptLoad() {
    console.log('Script loaded successfully.');
  }

function deleteUser(userId) {
    console.log("Llega aquí");
    // JavaScript code here
    axios.delete(`/api/users/${userId}`)
      .then(response => {
        location.reload()
      })
      .catch(error => {
        alert(error.response.data.error)
        console.log(error.response.data.error);
      });
}