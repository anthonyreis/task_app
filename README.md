# taskApp

# Aplicação de criação de Tasks

# Tecnologias Utilizadas no desenvolvimento
- [NodeJS](nodejs.org)
- [MongoDB](www.mongodb.com)
- [Mongoose](mongoosejs.com)
- [Express](expressjs.com)
- [JWT](www.npmjs.com/package/jsonwebtoken)
- [Multer](www.npmjs.com/package/multer)

# Funcionamento

## A aplicação dispõe de vários endpoints para realizar as operações.

## Criação de Usuário.
POST - **task-manager-br.herokuapp.com/users**
```json
 {
    "name": "Anthony Reis",
    "email": "matheus.anthony1@gmail.com",
    "password": "test123@",
    "age": 23
  }
```
## Login de Usuário
POST - **task-manager-br.herokuapp.com/users/login**

```json
  {
    "email": "anthony@yahoo.com",
    "password": "anthony1234@"
  }
```

## Modificar Usuário
PATCH - **task-manager-br.herokuapp.com/users/me**
```json
 {
    "name": "Anthony Reis",
    "email": "matheus.anthony1@gmail.com",
    "password": "test123@",
    "age": 23
  }
```

## Consultar seu Usuário
GET - **task-manager-br.herokuapp.com/users/me**

## Deletar Usuário
DELETE - **task-manager-br.herokuapp.com/users/me**

## Upload de Avatar
POST - **task-manager-br.herokuapp.com/users/me/avatar**

```
 Content-Type: multipart/form-data
 avatar: <image-binary>
```
## Deletar Avatar
DELETE - **task-manager-br.herokuapp.com/users/me/avatar**

## Criação de Task
POST - **task-manager-br.herokuapp.com/tasks**

```json
  {
    "description": "Do some stuff",
    "completed": true
  }
```
## Leitura de Task
### Todas as criadas
GET - **task-manager-br.herokuapp.com/tasks**
### Ordenadas por data de criação
GET - **task-manager-br.herokuapp.com/tasks?sortBy=createdAt:desc**
### Somente as completas/incompletas
GET - **task-manager-br.herokuapp.com/tasks?completed=true**
### Por quantidade
GET - **task-manager-br.herokuapp.com/tasks?limit=10**
### Especificada por ID
GET - **task-manager-br.herokuapp.com/tasks/\<id-da-task\>**

## Modificação da Task
PATCH - **task-manager-br.herokuapp.com/tasks/\<id-da-task\>**

```json
  {
    "description": "Do some stuff",
    "completed": true
  }
```

## Deletar Task
DELETE - **task-manager-br.herokuapp.com/tasks/\<id-da-task\>**

