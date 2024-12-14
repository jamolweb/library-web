// Utility function to verify teacher's token
export function verifyTeacher(token) {
  // In a real-world scenario, you would compare the token with an environment variable
  // For example, process.env.TEACHER_TOKEN
  const validToken = process.env.TEACHER_TOKEN;
  return token === validToken;
}
