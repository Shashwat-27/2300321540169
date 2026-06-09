# Stage 2 - Notification Storage Design

## Database Choice

i will use mongodb as notification data are in simpler format and no complex relation. also it is flexible so i can increase as requirement and read and write also be fast operation 


---

## Notification Collection Schema

```javascript
{
  _id: "N001",
  title: "Vehicle Task Alert",
  message: "Task T101 has high impact ",
  source: "vehicle",
  referenceId: "T101",
  isRead: false,
  createdAt: "2026-06-09T"
}
```

---

## Existing APIs Used

Vehicle API

```http
GET http://4.224.186.213/evaluation-service/vehicles
```

Response

```json
{
  "vehicles": [
    {
      "taskId": "T101",
      "duration": 120,
      "impact": "high"
    }
  ]
}
```

Depot API

```http
GET http://4.224.186.213/evaluation-service/depot
```

Response

```json
{
  "depots": [
    {
      "id": "D01",
      "mechanicHours": 45
    }
  ]
}
```

---

## Mapping with Stage 1 APIs

### Get All Notifications

```javascript
db.notifications.find().sort({ createdAt: -1 })
```

### Get Unread Notifications

```javascript
db.notifications.find({
  isRead: false
})
```

### Mark Notification as Read

```javascript
db.notifications.updateOne(
  { _id: "N001" },
  {
    $set: {
      isRead: true
    }
  }
)
```

---

## Notification Generated from Vehicle API

Vehicle API response:

```json
{
  "vehicles": [
    {
      "taskId": "T101",
      "duration": 120,
      "impact": "high"
    }
  ]
}
```

Stored notification:

```javascript
{
  _id: "N001",
  title: "Vehicle Task Alert",
  message: "Task T101 has high impact ",
  source: "vehicle",
  referenceId: "T101",
  isRead: false
}
```

---

## Notification Generated from Depot API

Depot API response:

```json
{
  "depots": [
    {
      "id": "D01",
      "mechanicHours": 45
    }
  ]
}
```

Stored notification:

```javascript
{
  _id: "N002",
  title: "Depot Update",
  message: "Depot D01 has 45 mechanic hours available",
  source: "depot",
  referenceId: "D01",
  isRead: false
}
```

---

## Problems as Data Increases

problem arises as volume of data increases

1. time in fetching notification that is lagging
2. DB size are continously increasing
3. performance issue can came on searching unread notification.
4. Bahut saare users same time par notifications access karenge to load increase hoga.

---

## Possible Solutions

### Indexing

create index on frequent use field

```javascript
db.notifications.createIndex({ isRead: 1 })

db.notifications.createIndex({ createdAt: -1 })
```

### Pagination

send records in limit instead of sending all notification at once

Example:

```http
GET /api/notifications?page=1&limit=20
```

### Archive Old Notifications

move previous notification in archieve

### Caching

frequently accessed notification ko redis cache mai add karenge jisse searching fast ho jayegi

---

## System Flow

notification service vehicle api aur depot api se data fetch karti hai. important updates ko notification documents me convert karke mongodb me store kiya jata hai. users rest apis ke through notifications dekh sakte hain aur unhe read mark kar sakte hain. real time updates ke liye websocket use kiya jata hai jisse notification instantly frontend tak pahunch jati hai.
