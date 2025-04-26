
# GroupSphere - Real-Time Group Communication Platform

> Communicate, Collaborate, Code — All in Real-Time!

---

## 🚀 Features
- Real-time group chat (text, images)
- Private one-to-one messaging between friends
- Group voice calls with live member status
- Online collaborative code editor with live updates
- Group management with admin roles
- Friend requests, block, and unblock
- Secure user authentication and authorization
- Fully encrypted messages and images
- Dockerized deployment

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Real-Time Communication**: Socket.IO
- **Authentication**: JWT, bcrypt
- **Cloud Storage**: Cloudinary
- **Deployment**: Docker & Docker Compose

---

## ⚙ Installation

### Clone the repository
```bash
git clone https://github.com/your-username/group-sphere.git
```

### Navigate to the project folder
```bash
cd group-sphere
```

### Install dependencies
```bash
npm install
```

---

### 📁 Environment Variables

Create a `.env` file and add the following:

```

MONGO_URI=

AUTH_USER_SEND_EMAIL =
AUTH_PASSWORD_SEND_EMAIL =
AUTH_HAST_SEND_EMAIL =
AUTH_PORT_SEND_EMAIL =

COOKIE_EXPIRES_TIME =
JWT_SECRET_KEY=
JWT_EXPIRES_TIME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SECRET_KEY =

CODE_SECRET = 

RAPID_API_KEY =

RAPID_HOST_KEY =
```

---

### ▶ Running the Application

#### Locally
```bash
npm run dev
```

#### Using Docker
```bash
docker-compose up
```

---

## 📚 API Endpoints

### <details>
<summary><b>Authentication</b></summary>

- `POST /api/v1/auth/register`  
- `POST /api/v1/auth/login`  
- `POST /api/v1/auth/verify/user`  
- `POST /api/v1/auth/verify/code`  
- `POST /api/v1/auth/forget-password`  
- `POST /api/v1/auth/verify/password-reset-code`  
- `POST /api/v1/auth/reset-password`

</details>

### <details>
<summary><b>User Management</b></summary>

- `GET /api/v1/user/{@handle}`  
- `GET /api/v1/user/profile`  
- `PUT /api/v1/user/edit/status`  
- `PUT /api/v1/user/edit/name`  
- `PUT /api/v1/user/block`  
- `PUT /api/v1/user/unblock`

</details>

### <details>
<summary><b>Group Management</b></summary>

- `POST /api/v1/group/`  
- `GET /api/v1/group/public`  
- `GET /api/v1/group/my`  
- `GET /api/v1/group/{groupId}`  
- `PUT /api/v1/group/{groupId}`  
- `DELETE /api/v1/group/{groupId}`  
- `POST /api/v1/group/{groupId}/invite`  
- `POST /api/v1/group/{groupId}/accept-invitation`  
- `POST /api/v1/group/{groupId}/reject-invitation`  
- `POST /api/v1/group/{groupId}/leave`  
- `GET /api/v1/group/{groupId}/members`  
- `POST /api/v1/group/{groupId}/upload-image`  
- `POST /api/v1/group/{groupId}/members/{userId}`  
- `PUT /api/v1/group/{groupId}/promote/{userId}`

</details>

### <details>
<summary><b>Group Messages</b></summary>

- `GET /api/v1/group/{groupId}/messages`  
- `POST /api/v1/group/{groupId}/message`  
- `DELETE /api/v1/group/{groupId}/message/{messageId}`  
- `POST /api/v1/group/{groupId}/voice`  
- `POST /api/v1/group/{groupId}/image`

</details>

### <details>
<summary><b>Voice Calls</b></summary>

- `POST /api/v1/call/{groupId}/start`  
- `POST /api/v1/call/{groupId}/end`  
- `POST /api/v1/call/{groupId}/join`  
- `POST /api/v1/call/{groupId}/leave`  
- `GET /api/v1/call/{groupId}/duration`  
- `GET /api/v1/call/{groupId}/members`  
- `GET /api/v1/call/{groupId}/calls`

</details>

### <details>
<summary><b>Online Compiler</b></summary>

- `POST /api/v1/compiler/{groupId}/run`  
- `GET /api/v1/compiler/{groupId}/files`  
- `POST /api/v1/compiler/{groupId}/files`  
- `GET /api/v1/compiler/file/{fileId}`  
- `DELETE /api/v1/compiler/file/{fileId}`  
- `PATCH /api/v1/compiler/file/{fileId}/updated-code`

</details>

### <details>
<summary><b>Friendship Management</b></summary>

- `POST /api/v1/friend/requests/{@handle}/send`  
- `POST /api/v1/friend/requests/{@handle}/accept`  
- `POST /api/v1/friend/requests/{@handle}/reject`  
- `POST /api/v1/friend/requests/{@handle}/unfriend`  
- `POST /api/v1/friend/requests/{@handle}/block`  
- `POST /api/v1/friend/requests/{@handle}/unblock`  
- `GET /api/v1/friend/`  
- `GET /api/v1/friend/requests`  
- `GET /api/v1/friend/blocked`

</details>

### <details>
<summary><b>Friend Messages</b></summary>

- `POST /api/v1/friend/message/{@handle}`  
- `PUT /api/v1/friend/message/{messageId}/{@handle}`  
- `DELETE /api/v1/friend/message/{messageId}/{@handle}`  
- `GET /api/v1/friend/messages/{@handle}`  
- `POST /api/v1/friend/messages/{@handle}/send-image`

</details>

---

## 📄 License

This project is licensed under the MIT License.