# notification_system_design.md

## Notification Service API Design

This service is responsible for displaying notifications to logged in users. User authentication is already handled by the main application, so no registration or login APIs are required as given in question

The service uses the existing Vehicle API and Depot API to generate notifications

### Existing APIs

#### Vehicle API
http
GET http://4.224.186.213/evaluation-service/vehicles


Response

json
{
  "vehicles": [
    {
      "taskId": "T101",
      "duration": 120,
      "impact": "high"
    }
  ]
}


#### Depot API
http
GET http://4.224.186.213/evaluation-service/depot


Response

json
{
  "depots": [
    {
      "id": "D01",
      "mechanicHours": 45
    }
  ]
}


---

## Common Headers

http
Authorization: Bearer <token>
Content-Type: application/json


---

## Get Notifications

Returns all notifications available for the current user.

http
GET /api/notifications


Response

json
{
  "notifications": [
    {
      "id": "N001",
      "title": "Vehicle Task Alert",
      "message": "Task T101 has high impact and duration 120 minutes",
      "source": "vehicle",
      "referenceId": "T101",
      "isRead": false,
      "createdAt": "2026-06-09T10:30:00Z"
    },
    {
      "id": "N002",
      "title": "Depot Update",
      "message": "Depot D01 has 45 mechanic hours available",
      "source": "depot",
      "referenceId": "D01",
      "isRead": false,
      "createdAt": "2026-06-09T10:35:00Z"
    }
  ]
}


---

## Get Unread Notifications
http
GET /api/notifications/unread


Response

json
{
  "notifications": [
    {
      "id": "N001",
      "title": "Vehicle Task Alert",
      "message": "Task T101 has high",
      "isRead": false
    }
  ]
}


---

## Mark Notification as Read
http
PATCH /api/notifications/{id}/read


Request

json
{
  "isRead": true
}


Response

json
{
  "message": "Notification marked as read"
}


---

## Notification Object

json
{
  "id": "N001",
  "title": "Vehicle Task Alert",
  "message": "Task T101 has high impact",
  "source": "vehicle",
  "referenceId": "T101",
  "isRead": false,
  "createdAt": "2026-06-09T10:30:00Z"
}


---

## Real Time Notification Design

WebSocket can be used for real time notifications.

Connection:

http
ws://localhost:3000/notifications


When a new vehicle task or depot update is detected, the server pushes a notification event to connected users.

Example Event

json
{
  "event": "new-notification",
  "data": {
    "id": "N001",
    "title": "Vehicle Task Alert",
    "message": "Task T101 has high impact"
  }
}


This allows the frontend to update the notification list instantly without refreshing the page.

---

## Flow

1. Notification service fetches data from Vehicle API and Depot API.
2. Important updates are converted into notifications.
3. Notifications are returned through REST APIs.
4. WebSocket is used to push new notifications in real time.
