import jwt from 'jsonwebtoken'

export async function verifyAuth(request) {
	try {
		const token = request.headers.get('authorization')?.split(' ')[1]

		if (!token) {
			return {
				success: false,
				error: 'No token provided',
			}
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		return {
			success: true,
			user: decoded,
		}
	} catch (error) {
		return {
			success: false,
			error: 'Invalid token',
		}
	}
}

export function generateToken(payload) {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '1h',
	})
}
