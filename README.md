# coder_backend_pf
Proyecto Final Programación Backend

##### Autor
Leonardo Burbano

### Consideraciones
Se incluyó una colección de postman con los test realizados.


### Iniciar
0. Revisar variables de entorno, se ha incluido un archivo `.env.example` que se puede transformar en `.env`. Eventualmente, se eliminará este archivo una vez aprobado el trabajo.
1. `npm install`
2. Para ejecutar la aplicación: `npm start`


### Ambientes
**Local:** localhost:8080/
**Prod:** https://leo-burbano-coder-backend-pf.onrender.com/


### Credenciales 
- **Admin**
admin@coderhouse-backend.com
iVgdlNawQEzD

- **User**
test-user2@coderhouse-backend.com
user123456

- **User con última conexión hace más de 2 días**
test-user2@coderhouse-backend.com
user123456

### Tests

**0.** Se adjunta una colección de requests de Postman con los tests solicitados: Get users, Delete Users, Add product, Delete product + Email confirmation.
**CoderhouseBackend_Cuarta_Practica_Integradora.postman_collection.json**

**Alerta:** Se recomienda hacer la prueba de eliminación de usuarios una vez finalizadas todas las otras pruebas. Ya que los usuarios pudieron ser creados hace más de dos días.

<br></br>

**1.** Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce. Se requiere estar logueado como Admin para acceder a esta URL:
`https://leo-burbano-coder-backend-pf.onrender.com/admin/users`
`http://localhost:8080/admin/users`
<br></br>

**2.** Mantener un correcto manejo de sesiones
- En la colección de Postman se adjunta un request para registrar cualquier tipo de usuario.
- **IMPORTANTE:** También, se ha agregado un request para registrar los documentos de cualquier usuario y poderlo transformar en **premium**.
<br></br>

**3.** Proceso de compra
- Usuario premium no puede comprar productos suyos. 
**NOTA:** Los productos nuevos se agregan en la última página (al final): 
`https://leo-burbano-coder-backend-pf.onrender.com/products?page=10`
`http://localhost:8080/products?page=10`
    - Test Local: **[Passed]** 
    - Test Prod: **[Passed]**
- Admin no puede comprar. 
    - Test Local: **[Passed]**
    - Test Prod: **[Passed]**
<br></br>

**4.** Agregar o quitar productos del carrito. 
- Test Local: **[Passed]** 
- Test Prod: **[Passed]**
<br></br>

**5.** Cierre completo de compra con información. 
- Test Local: **[Passed]**
- Test Prod: **[Passed]**