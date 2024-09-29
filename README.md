Favorite Movies API
Descripción
Esta es una API diseñada para gestionar usuarios y sus películas favoritas. Permite registrar usuarios, autenticarlos, obtener películas, agregar películas a una lista de favoritos, obtener las películas favoritas de un usuario, y realizar el cierre de sesión (logout).

Funcionalidades
Registrar Usuario

Endpoint: POST /api/users
Descripción: Registra un nuevo usuario en el sistema.
Parámetros: email, firstName, lastName, password
Respuesta exitosa: 200 {"message":"User created"}
Autenticar Usuario

Endpoint: POST /api/login
Descripción: Autentica al usuario y devuelve un token de autenticación.
Parámetros: email, password
Respuesta exitosa: 200 {"auth_token": "<token>"}
Obtener Películas

Endpoint: GET /api/movies/list
Descripción: Obtiene una lista de películas. Puede incluir un filtro opcional por palabra clave.
Parámetros: auth_token, keyword (opcional)
Respuesta exitosa: 200 con un array de películas.
Agregar Películas a Favoritos

Endpoint: POST /api/movies/fav
Descripción: Agrega una película a la lista de favoritos del usuario.
Parámetros: auth_token, movieId
Respuesta exitosa: 200 {"message":"Movie added to favorites"}
Obtener Películas Favoritas

Endpoint: GET /api/movies/fav
Descripción: Obtiene las películas favoritas del usuario.
Parámetros: auth_token
Respuesta exitosa: 200 con un array de películas favoritas.
Logout / Invalidate Token

Endpoint: DELETE /api/logout
Descripción: Invalida el token de autenticación actual.
Parámetros: auth_token
Respuesta exitosa: 200 {"message":"Token invalidated"}
Configuración del archivo .env
Es necesario crear un archivo .env en el directorio raíz de la API con el siguiente formato para configurar las credenciales de la base de datos, el API de themoviedb.org, y la clave de los tokens JWT:

bash
Copy code
DB_USER=username
DB_PASSWORD=password
DB_NAME=database
MYSQL_ROOT_PASSWORD=password
api_key=you_themoviedb_api_key
JWT_KEY=KEY_FOR_HASHING
Asegúrate de reemplazar los valores de ejemplo con tus credenciales reales y la clave de tu API de themoviedb.org.

Configuración de Docker
Para simplificar el proceso de inicio de la API, se utiliza un contenedor Docker que maneja las variables de entorno y la base de datos.

Pasos para ejecutar la API:
Iniciar el servidor MySQL:

Comando: docker-compose up mysql -d
Asegúrate de esperar unos segundos para que el servidor MySQL esté listo.
Iniciar el servidor Node.js:

Comando: docker-compose up nodejs --build
El servidor estará escuchando en el puerto 8080.
Ejemplos con Postman
Se puede utilizar Postman para realizar pruebas a los endpoints descritos. Asegúrate de incluir el token de autenticación en el header de las solicitudes que lo requieran.

Decisiones de Diseño del Sistema
Sistema de películas favoritas: Para evitar almacenar datos redundantes, solo se guarda el ID de la película y el ID del usuario en la base de datos. Los detalles de las películas se obtienen de themoviedb.org.

Sistema de logout: Los tokens inválidos se almacenan en una tabla de la base de datos. El sistema verifica que el token no esté en esta tabla durante el proceso de autenticación.

Autor
Santiago Lopez de Haro
Versión
1.0 - 11/09/2024 - Versión inicial
