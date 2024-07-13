package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Item struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Title     string `json:"title"`
	Category  string `json:"category"`
	CatID     int    `json:"CatID"`
}

func main() {
	fmt.Println("Hello world")

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{"msg": "hello World"})
	})

	log.Fatal(app.Listen(":4000"))
}
