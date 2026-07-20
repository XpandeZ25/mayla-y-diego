# Virus! en Jupiter

Juego local para 2 personas en dispositivos distintos dentro de la misma red.

## Ejecutar

1. Abre una terminal en esta carpeta.
2. Ejecuta:

```powershell
node server.js
```

3. En el ordenador abre:

```text
http://localhost:3000/virus.html
```

4. En el otro dispositivo abre la misma direccion usando la IP del ordenador, por ejemplo:

```text
http://192.168.1.50:3000/virus.html
```

Un jugador crea sala y comparte el codigo de 6 digitos. El otro jugador se une con ese codigo.

## Nota

Esta version no usa dependencias externas. La sincronizacion se hace con servidor Node y polling corto para que funcione sin instalar paquetes.
