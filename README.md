# ticketing_tool# Getting started

## Requirements

* node
* npm

## Start Server

First, you have to install dependencies

- `cd server`
- `npm i`

Afterwards, you will need to copy the environment variables from .env.example to a new file named `.env`

then start the server using:

- `npm run postinstall`
- `npm start`

OR

- `npm run dev`

# Available endpoints

If you are running the server locally, then the domain will be localhost running on port 5001 (`localhost:5001`)

## Users

Users endpoints are not consumed by the frontend

- Get `{{base_url}}/v1/users/` with `bearer token` in the headers
- Patch `{{base_url}}/v1/users/` with `bearer token` in the headers
- Delete `{{base_url}}/v1/users/` with `bearer token` in the headers
    - Username and password are required in the body
- Post `{{base_url}}/v1/users/login` (login Route)
    - Username and password are required in the body


## Tickets

- Get `{{base_url}}/v1/tickets?completed=<completed>&sortBy=<field>&order=<desc,any>`
- Post `{{base_url}}/v1/ticket`
    - example JSON body:
        - 
        ```{
            "title": "ticket title_3",
            "description": "This is a generic description of the current ticket_3",
            "completed": false
        } ```
- Put `{{base_url}}/v1/tickets/:id`
    - example JSON body:
        - 
        ```{
            "title": "ticket title_3",
            "description": "This is a generic description of the current ticket_3",
            "completed": false
        } ```
- Delete `{{base_url}}/v1/tickets/:id`

## Start client side:

First, you have to install dependencies

- `cd client_side`
- `npm i`

Afterwards, you will need to copy the environment variables from .env.example to a new file named `.env`

then start the client web app using:

- `npm start`