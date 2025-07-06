#  Document knowledge base system

##  Tech
```bash
Database: LokiJS embedded NoSQL database
Testing: Jest with Supertest for integration testing
```
##  Getting Started

###  Installation

```bash
npm install
```
###  ⚙️ Configuration
#### Create adminUser.json in the config directory with your initial admin user details:

```bash
{
 "name": "Test User",
  "email": "example@example.com",
  "role": "Admin",
  "createdAt": "2023-10-01T12:00:00Z",
  "updatedAt": "2023-10-01T12:00:00Z"
}
```
#### Configure permissions in permissionsData.json (also inside config):
```bash
[{ "role": "Admin", "canCreate": true, "canEdit": true, "canDelete": true, "canView": true },

{ "role": "Editor", "canCreate": false, "canEdit": true, "canDelete": false, "canView": true },

{ "role": "Viewer", "canCreate": false, "canEdit": false, "canDelete": false, "canView": true }]

```
### 🚀 Running the Server
```bash
npm run dev
```
#### Server will start on default port (e.g., http://localhost:1230). You can change this in root index.ts

### 🚀 Running Test
```bash
npm test
```

##  Usage
###  Authentication
#### Add x-api-key to header with user email as the value

```bash
x-api-key: user@example.com
```
###  Routes
#### Users
```bash
POST /api/users - Create a new user
GET /api/users/:email - Get user by email
GET /api/users/:email - Update user by email
GET /api/users - Get all users
```

#### Topics
```bash
POST /api/topic - Create a new topic
PUT /api/topic/:topicId - Update existing topic
GET /api/topic/:topicId - Get a specific topic with tree structure
GET /api/topic - Get all topics with tree structure
DELETE /api/topic/:topicId - Delete a topic
```
##  Extras
### Project Structure
```bash
config - Configuration files and database setup
controllers - API endpoint controllers
middleware - Express middleware (auth, error handling)
models - Data models and interfaces
repositories - Data access layer
services - Business logic
factories - Object creation patterns
utils - Utility functions
tests - Test suite
```
### Error Management
#### Errors are written to a logs folder in the root directory (Make sure the root folder can be writen to). The error files are generated everyday using error-date.log

