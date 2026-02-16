import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { UpdateUserDTO } from '../types';
import { Role } from '../types';

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const role = req.query.role as Role | undefined;
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
        const search = req.query.search as string | undefined;

        const skip = (page - 1) * limit;

        const where: any = {};
        if (role) where.role = role;
        if (isActive !== undefined) where.isActive = isActive;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isVerified: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, email, role, isActive }: UpdateUserDTO = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        // Check if email is already taken by another user
        if (email && email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email } });
            if (emailTaken) {
                throw new BadRequestError('Email already in use');
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(role && { role }),
                ...(isActive !== undefined && { isActive }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isVerified: true,
                isActive: true,
                updatedAt: true,
            },
        });

        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user: updatedUser },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        await prisma.user.delete({ where: { id } });

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const changeUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { role }: { role: Role } = req.body;

        if (!role || !Object.values(Role).includes(role)) {
            throw new BadRequestError('Invalid role');
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
            },
        });

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: { user: updatedUser },
        });
    } catch (error) {
        next(error);
    }
};

export const toggleUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
            },
        });

        res.json({
            success: true,
            message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { user: updatedUser },
        });
    } catch (error) {
        next(error);
    }
};