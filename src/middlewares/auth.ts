import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from "@prisma/client"

export interface RequestWithUser extends Request {
  user: {
	id: string;
	role: UserRole;
  };
}

export const authentication = (req: Request, res: Response, next: NextFunction) => {
	// Get token from header
	const token = req.header('x-auth-token');

	// Check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, auth denied' });
	}

	if (!process.env.JWT_SECRET) {
		return res.status(500).json({ msg: 'Internal server error' });
	}

	// Verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
		(req as RequestWithUser).user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};

export const authenticationAdmin = (req: Request, res: Response, next: NextFunction) => {
	// Get token from header
	const token = req.header('x-auth-token');

	// Check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, auth denied' });
	}

	if (!process.env.JWT_SECRET) {
		return res.status(500).json({ msg: 'Internal server error' });
	}

	// Verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
		if (decoded.user.role === "DEFAULT") {
			return res.status(403).json({
				error: "USR-08",
				message: "Not authorized"
			  });
		}
		
		(req as RequestWithUser).user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};