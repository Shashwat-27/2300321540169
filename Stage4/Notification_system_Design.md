# stage 4

currently notifications are fetched from the database on every page load for every student

with 50000 students and millions of notifications this creates unnecessary load on the database and increases response time

i would use a combination of caching pagination and real time updates instead of querying the database every time

## 1. redis caching

when a student opens the application the notification list can be stored in redis for a short period such as 5 to 10 minutes

flow:

```text
user -> redis cache -> database
```

if data exists in cache then database is not queried

advantages:

* very fast response time
* reduces database load significantly
* improves user experience

trade offs:

* additional infrastructure is required
* cache invalidation becomes important when new notifications arrive

---

## 2. pagination

instead of loading all notifications only a small set should be returned

example:

```http
GET /api/notifications?page=1&limit=20
```

advantages:

* less data transferred over network
* lower memory usage
* faster query execution

trade offs:

* frontend must handle multiple pages
* user may need additional requests to view older notifications

---

## 3. unread count caching

most users only need to see the unread notification count

instead of loading complete notifications on every page load

```http
GET /api/notifications/unread-count
```

can return

```json
{
  "count": 5
}
```

advantages:

* very small response size
* minimal database work

trade offs:

* additional api endpoint to maintain

---

## 4. websocket based updates

instead of polling the server on every page refresh the frontend can keep a websocket connection open

when a new notification is created the server pushes it directly to connected users

advantages:

* real time updates
* almost no repeated database reads
* better user experience

trade offs:

* websocket infrastructure is more complex
* connection management is required for large number of users

---

## 5. database indexing

indexes on studentId isRead createdAt and notificationType help mysql find records faster

example:

```sql
create index idx_student_read_created
on notifications(studentId,isRead,createdAt)
```

advantages:

* faster query execution
* improves search and sorting performance

trade offs:

* indexes consume extra storage
* insert and update operations become slightly slower

---

## recommended approach

i would use pagination together with redis caching and websocket updates

pagination reduces the amount of data being loaded

redis reduces repeated database queries

websocket removes the need to fetch notifications on every page load

this combination provides better scalability and improves user experience while keeping database load under control.
