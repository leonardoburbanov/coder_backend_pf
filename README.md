# coder_backend_pf
Proyecto Final Programación Backend

## Autor
Leonardo Burbano

## Consideraciones
1. Se incluyó una colección de postman con los test realizados.


## Iniciar
0. Revisar variables de entorno
1. `npm install`
2. Para ejecutar la aplicación: `npm start`


## Ambientes
local: localhost:8080/
prod: https://leo-burbano-coder-backend-pf.onrender.com/


## Credenciales
1. Admin:
admin@coderhouse-backend.com
iVgdlNawQEzD


## Tests
0. Se adjunta una colección de requests de Postman con los tests solicitados: Get users, Delete Users, Add product, Delete product + Email confirmation.
**CoderhouseBackend_Cuarta_Practica_Integradora.postman_collection.json**

1. Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce
2. Mantener un correcto manejo de sesiones
- En la colección de Postman se adjunta un request para registrar cualquier tipo de usuario.
- También, se ha agregado

3. Proceso de compra
- Usuario premium no puede comprar productos suyos. Test Local: **[Passed]** Test Prod: **[]**
- Admin no puede comprar. Test Local: **[Passed]** Test Prod: **[]**
4. Agregar o quitar productos del carrito. Test Local: **[Passed]** Test Prod: **[]**
5. Cierre completo de compra con información. Test Local: **[Passed]** Test Prod: **[]**