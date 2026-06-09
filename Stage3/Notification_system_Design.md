# stage 3

the query is logically correct but it can become slow when the notifications table contains around 5 million rows
------------------------------------------------
```sql
select *
from notifications
where studentId = 1042
and isRead = false
order by createdAt desc
```
------------------------------------------
without a proper index mysql may need to scan a large number of rows before finding matching notifications for the student

the sorting on createdAt can also add extra work when many notifications belong to the same student

i would create a composite index instead of relying on individual indexes

```sql
create index idx_student_read_created
on notifications(studentId, isRead, createdAt)
```
----------------------------------------------
after adding this index mysql can directly find unread notifications for the student and return them in sorted order with much less work

the original query can be improved as
-------------------------------------------
```sql
select id,
       title,
       message,
       createdAt
from notifications
where studentId = 1042
and isRead = false
order by createdAt desc
limit 50
```
----------------------------------------

using limit helps because the frontend usually does not need thousands of notifications at once

in the current situation the cost can be close to scanning millions of rows if no suitable index exists

after using the composite index the cost becomes much smaller because mysql can use the index to directly reach the required records

another developer suggested creating an index on every column to be safe

i would not recommend this approach

too many indexes increase storage usage and make insert update and delete operations slower because every index must also be updated

indexes should only be created on columns that are frequently used for filtering sorting or joining

for this notification system studentId isRead createdAt and notificationType are good candidates for indexing

to find all students who received placement notifications in the last 7 days

```sql
select distinct studentId
from notifications
where notificationType = 'PLACEMENT'
and createdAt >= now() - interval 7 day
```

to make this query faster an additional index can be created

```sql
create index idx_type_created
on notifications(notificationType, createdAt)
```

this allows mysql to quickly locate placement notifications from the last seven days without scanning the entire table.
