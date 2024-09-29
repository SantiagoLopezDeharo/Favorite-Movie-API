# Favorite Movies API

## Descripción

Esta es una API diseñada para gestionar usuarios y sus películas favoritas. Permite registrar usuarios, autenticarlos, obtener películas, agregar películas a una lista de favoritos, obtener las películas favoritas de un usuario, y realizar el cierre de sesión (logout).

## Funcionalidades

1. **Registrar Usuario**
   - Endpoint: `POST /api/users`
   - Descripción: Registra un nuevo usuario en el sistema.
   - Parámetros: `email`, `firstName`, `lastName`, `password`
   - Respuesta exitosa: `200 {"message":"User created"}`

2. **Autenticar Usuario**
   - Endpoint: `POST /api/login`
   - Descripción: Autentica al usuario y devuelve un token de autenticación.
   - Parámetros: `email`, `password`
   - Respuesta exitosa: `200 {"auth_token": "<token>"}`

3. **Obtener Películas**
   - Endpoint: `GET /api/movies/list`
   - Descripción: Obtiene una lista de películas. Puede incluir un filtro opcional por palabra clave.
   - Parámetros: `auth_token`, `keyword` (opcional)
   - Respuesta exitosa: `200` con un array de películas.

4. **Agregar Películas a Favoritos**
   - Endpoint: `POST /api/movies/fav`
   - Descripción: Agrega una película a la lista de favoritos del usuario.
   - Parámetros: `auth_token`, `movieId`
   - Respuesta exitosa: `200 {"message":"Movie added to favorites"}`

5. **Obtener Películas Favoritas**
   - Endpoint: `GET /api/movies/fav`
   - Descripción: Obtiene las películas favoritas del usuario.
   - Parámetros: `auth_token`
   - Respuesta exitosa: `200` con un array de películas favoritas.

6. **Logout / Invalidate Token**
   - Endpoint: `DELETE /api/logout`
   - Descripción: Invalida el token de autenticación actual.
   - Parámetros: `auth_token`
   - Respuesta exitosa: `200 {"message":"Token invalidated"}`

## Configuración del archivo `.env`

Es necesario crear un archivo `.env` en el directorio raíz de la API con el siguiente formato para configurar las credenciales de la base de datos, el API de themoviedb.org, y la clave de los tokens JWT:

```bash
DB_USER=username
DB_PASSWORD=password
DB_NAME=database
MYSQL_ROOT_PASSWORD=password
api_key=you_themoviedb_api_key
JWT_KEY=KEY_FOR_HASHING
```

## Configuración de Docker

Para simplificar el proceso de inicio de la API, se utiliza un contenedor Docker que maneja las variables de entorno y la base de datos.

### Pasos para ejecutar la API:

1. **Iniciar el servidor MySQL**:
   - Comando: `docker-compose up mysql -d`
   - Asegúrate de esperar entre 5 y 10 segundos para que el servidor MySQL esté listo, ya que necesita crear todos los archivos necesarios.

2. **Iniciar el servidor Node.js**:
   - Comando: `docker-compose up nodejs --build`
   - El servidor Node.js estará escuchando en el puerto `8080`. Puedes cambiar este puerto en el archivo `index.js` si es necesario.

## Decisiones de Diseño del Sistema

- **Sistema de películas favoritas**: 
   Para almacenar las películas favoritas de los usuarios, solo se guarda el ID de la película y el ID del usuario en una tabla de la base de datos. Los detalles de las películas no se almacenan localmente, ya que se obtienen desde [themoviedb.org](https://www.themoviedb.org) mediante solicitudes paralelas cuando el cliente solicita la lista de películas favoritas. Este enfoque evita la redundancia de datos.
   
   En pruebas realizadas, el tiempo promedio de respuesta fue de 150 ms, lo cual es adecuado para este caso. En un entorno de producción, si fuera necesario mejorar el rendimiento, se podría implementar una tabla de caché para las películas más consultadas, pero no fue necesario en este demo.

- **Sistema de logout**: 
   Para invalidar tokens, el sistema almacena en una tabla de la base de datos los tokens que han sido utilizados para hacer logout. Durante el proceso de autenticación, el sistema verifica si el token está en esa tabla para asegurarse de que no sea válido.

   Además, se podría implementar un proceso periódico para limpiar los tokens expirados de esta lista y liberar espacio de almacenamiento, aunque esto no se ha implementado aún.
