
const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGFzaHdhdC4yM2IxNTQxMDQ4QGFiZXMuYWMuaW4iLCJleHAiOjE3ODA5ODU5MDcsImlhdCI6MTc4MDk4NTAwNywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjMzZTc0MjczLWYxMDEtNDQ5Mi05MjIzLTk3NTkxYWUxZTYyYiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNoYXNod2F0IHByYWthc2ggcGFuZGV5Iiwic3ViIjoiYTQ2ZWE0ZGUtZWEwOS00OTAyLWE3YmUtM2IxOTRkNjllY2QyIn0sImVtYWlsIjoic2hhc2h3YXQuMjNiMTU0MTA0OEBhYmVzLmFjLmluIiwibmFtZSI6InNoYXNod2F0IHByYWthc2ggcGFuZGV5Iiwicm9sbE5vIjoiMjMwMDMyMTU0MDE2OSIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6ImE0NmVhNGRlLWVhMDktNDkwMi1hN2JlLTNiMTk0ZDY5ZWNkMiIsImNsaWVudFNlY3JldCI6InRTd0ZrSkVVZG1yblJ4YlkifQ.kiThcjR-Rr-Ts2tWNqRlhrZghjjQNSUkaGegxGtc2rU";

const PRIORITY_WEIGHT = {
    PLACEMENT: 3,
    RESULT: 2,
    EVENT: 1
};

async function getTopPriorityNotifications() {
    try {
        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/notification",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        const notifications =
            response.data.notifications || [];

        const unreadNotifications =
            notifications.filter(
                notification =>
                    notification.isRead === false
            );

        const rankedNotifications =
            unreadNotifications.map(
                notification => {

                    const weight =
                        PRIORITY_WEIGHT[
                            notification.notificationType
                        ] || 0;

                    const createdTime =
                        new Date(
                            notification.createdAt
                        ).getTime();

                    return {
                        ...notification,
                        priorityScore:
                            weight * 1000000000000 +
                            createdTime
                    };
                }
            );

        rankedNotifications.sort(
            (a, b) =>
                b.priorityScore -
                a.priorityScore
        );

        return rankedNotifications.slice(0, 10);

    } catch (error) {

        console.error(
            "failed to fetch notifications"
        );

        return [];
    }
}

async function main() {

    const topNotifications =
        await getTopPriorityNotifications();

    console.log(
        "top 10 priority notifications"
    );

    console.table(topNotifications);
}

main();
