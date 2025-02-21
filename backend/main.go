package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("Error upgrading connection:", err)
		return
	}
	defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}
		fmt.Println("Received:", string(msg))

		err = conn.WriteMessage(websocket.TextMessage, []byte("Message received: "+string(msg)))
		if err != nil {
			fmt.Println("Error writing message:", err)
			break
		}
	}
}

func main() {
	r := gin.Default()

	// WebSocket route
	r.GET("/ws", handleWebSocket)

	// API route for AI-powered task recommendations (Mock Response)
	r.GET("/api/tasks", func(c *gin.Context) {
		tasks := []map[string]string{
			{"id": "1", "name": "Complete Golang WebSocket"},
			{"id": "2", "name": "Implement AI Chat"},
			{"id": "3", "name": "Integrate Frontend & Backend"},
		}
		c.JSON(http.StatusOK, tasks)
	})

	r.Run(":8080") // Runs on http://localhost:8080
}
