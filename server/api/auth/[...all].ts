// Forward all /api/auth/* requests to Better Auth.
export default defineEventHandler((event) => {
  return useServerAuth(event).handler(toWebRequest(event))
})
