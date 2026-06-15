1. crear una carpeta, para iniciar la api
2. pnpm init
3. crear una carpeta donde se guarde todo mis archivos "src"
4. crear el archivo index.js en "src"
5. correr el archivo: node .\src\index.js
6. levantar el servidor: pnpm add express --https://expressjs.com/en/5x/starter/installing/
7. dato curioso: si se instala un paquete erroneo: pnpm remove 
8. correr la api: node .\src\index.js
9. en el archivo package.json,  "dev": "node src/index.js" dentro de Script, aca se usa pnpm dev para invocar el mismo archivo, o equivalente al punto 8
10. Instalar la siguiente Dependecia para que automaticamente haga los cambios en el servidor, sin estar quitando y ejecutando el server. 
pnpm add -D nodemon //https://nodemon.io/ esa instalacion es en local pnpm install -g nodemon (global)
11. crear afuera de la carpeta src, un archivo nodemon.json y escribir:
{
    "watch": ["src"],
    "ext": "js",
    "ignore": ["node_modules"],
    "exec": "node src/index.js"
}
12. si falla algo, borrar la carpeta node_modules, entonces instalar todas las dependencias con el siguiente comando: 
pnpm install

//SIGUIENTE SESION
1. Variables de entorno, crear un archivo .dev que sera una variable global 
2. ejecutar el comando pnpm add dotenv
3. en index.js importar: import 'dotenv/config';
4. para ejecutar la variable de entorno: const PORT = process.env.PORT
