# Mock REST API Server

Mock Express server para probar el chat widget de DoubleoO localmente y con ngrok.

## Instalación

```bash
cd packages/restapi
npm install
```

## Ejecutar el servidor

```bash
npm run dev    # Con watch mode para development
# o
npm start      # Modo normal
```

El servidor correrá en http://localhost:3001

## Uso

### 1. Probar localmente
- Ve a http://localhost:3001/test.html
- Deberías ver el widget de chat en la esquina inferior derecha
- Todas las requests se logearán en la consola del servidor

### 2. Probar con ngrok
```bash
# En otra terminal
ngrok http 3001
```

Luego puedes acceder a la URL de ngrok para probar desde cualquier dispositivo.

### 3. Probar con tu propio widget local

Para probar tu desarrollo local del widget:

1. Inicia tu servidor Next.js: `npm run dev` (puerto 3000)
2. Configura la variable de entorno para que apunte a tu mock API:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
3. En el HTML de prueba, cambia el src del script:
   ```html
   <script src="http://localhost:3000/chat-widget.js" ...>
   ```

## Endpoints simulados

El servidor mock implementa todos los endpoints que necesita el widget:

- `GET /api/chats/:chatId` - Configuración del chat
- `GET /api/chats/:chatId/widget` - Configuración del widget
- `GET /api/chats/:chatId/welcome_message` - Mensaje de bienvenida
- `POST /api/chats/:chatId/conversations` - Crear conversación
- `GET /api/chats/:chatId/conversations/:id/messages` - Mensajes de conversación
- `POST /api/chats/:chatId/conversations/:id/completion_stream` - Respuesta streaming

## Logging

Todas las requests se loggean con:
- Timestamp
- Método HTTP
- URL completa
- Headers (incluyendo x-api-key)
- Body de la request
- Respuesta simulada

Perfect para debuggear qué está enviando el widget al servidor.