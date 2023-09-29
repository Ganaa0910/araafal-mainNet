const APIURL =
    process.env.NODE_ENV == 'production' ? '' : 'http://localhost:3001'
export async function fetchRaffles() {
    const response = await fetch(`${APIURL}/api/raffles`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}
