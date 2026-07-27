if (!process.env.HYGRAPH_URL) throw new Error('HYGRAPH_URL environment variable is not set')
if (!process.env.HYGRAPH_TOKEN) throw new Error('HYGRAPH_TOKEN environment variable is not set')

// 3 times a day — revalidate every 8 hours
const DEFAULT_REVALIDATE = 60 * 60 * 8 // 28800 seconds

export const fetchHygraphQuery = async <T>(
  query: string,
  revalidate: number = DEFAULT_REVALIDATE
): Promise<T> => {
  const response = await fetch(process.env.HYGRAPH_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query }),
    next: {
      revalidate,
    },
  })

  const { data } = await response.json()

  return data
}
