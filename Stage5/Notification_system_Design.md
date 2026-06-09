

# stage 5

the current implementation has several problems

```text
function notify_all(student_ids,message)

for student_id in student_ids:
    send_email(student_id,message)
    save_to_db(student_id,message)
    push_to_app(student_id,message)
```

## shortcomings

1. everything runs sequentially so processing 50000 students will take a long time

2. if send_email fails for some students then the loop may stop before all notifications are processed

3. email sending is usually slower than database operations and can become a bottleneck

4. if the application crashes in the middle then some students may receive notifications while others may not

5. there is no retry mechanism for failed email deliveries



## what happens if email fails for 200 students

if email sending fails after processing part of the list then those students may never receive the email

it also becomes difficult to know which students were successfully notified and which were not

this creates an inconsistent state in the system



## should saving to db and sending email happen together

i would not make them dependent on each other

saving the notification in the database is the most important operation because it creates the official record of the notification

email delivery is a secondary channel and can be retried later if it fails

if both operations are tightly coupled then an email failure could prevent the notification from being stored



## improved design

first save notifications to the database using bulk inserts

after successful storage create email jobs and push them to a queue

background workers can process email jobs independently


hr -> notification service -> bulk save to db -> queue -> email workers -> students

hr -> notification service -> websocket push -> online students

## revised pseudocode

```text
function notify_all(student_ids,message)

    notifications = []

    for student_id in student_ids

        notifications.add({
            studentId: student_id,
            message: message,
            isRead: false
        })

    bulk_save_to_db(notifications)

    for student_id in student_ids

        add_email_job_to_queue(
            student_id,
            message
        )

        push_to_app(
            student_id,
            message
        )
```

worker process

```text
function email_worker()

    while queue not empty

        job = get_next_job()

        try
            send_email(
                job.studentId,
                job.message
            )

        catch error
            retry_job(job)
```



## benefits

1. notifications are stored reliably before email delivery starts

2. failed emails can be retried without affecting stored notifications

3. bulk inserts reduce database load

4. queue based processing improves scalability

5. users receive in app notifications quickly even if email delivery is delayed

6. the system can handle placement season traffic more efficiently.
