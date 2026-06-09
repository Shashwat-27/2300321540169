
const axios = require("axios");

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";


const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGFzaHdhdC4yM2IxNTQxMDQ4QGFiZXMuYWMuaW4iLCJleHAiOjE3ODA5ODU5MDcsImlhdCI6MTc4MDk4NTAwNywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjMzZTc0MjczLWYxMDEtNDQ5Mi05MjIzLTk3NTkxYWUxZTYyYiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNoYXNod2F0IHByYWthc2ggcGFuZGV5Iiwic3ViIjoiYTQ2ZWE0ZGUtZWEwOS00OTAyLWE3YmUtM2IxOTRkNjllY2QyIn0sImVtYWlsIjoic2hhc2h3YXQuMjNiMTU0MTA0OEBhYmVzLmFjLmluIiwibmFtZSI6InNoYXNod2F0IHByYWthc2ggcGFuZGV5Iiwicm9sbE5vIjoiMjMwMDMyMTU0MDE2OSIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6ImE0NmVhNGRlLWVhMDktNDkwMi1hN2JlLTNiMTk0ZDY5ZWNkMiIsImNsaWVudFNlY3JldCI6InRTd0ZrSkVVZG1yblJ4YlkifQ.kiThcjR-Rr-Ts2tWNqRlhrZghjjQNSUkaGegxGtc2rU";

async function logger(level, packageName, message) {
  try {
    const response = await axios.post(
      LOG_API_URL,
      {
        stack: "backend",
        level: level,
        package: packageName,
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

module.exports = logger;