import crypto from 'crypto';
import User from '../models/User';
import { jwt } from '../lib/jwt';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key';

interface UserDocument extends Document {
    _id: string;
    email: string;
    password: string;
    fullName: string;
    role: 'user' | 'admin';
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export const authService = {
    async register(email: string, password: string, fullName: string) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Create verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Create new user
            const user = new User({
                email,
                password,
                fullName,
                verificationToken,
            });

            await user.save();

            // In a real application, you would send this token via email
            console.log('Verification token:', verificationToken);

            return { success: true, message: 'Registration successful. Please check your email for verification.' };
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    async login(email: string, password: string) {
        try {
            // Find user
            const user = await User.findOne({ email }).select('+password') as UserDocument;
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check if user is verified
            if (!user.isVerified) {
                throw new Error('Please verify your email first');
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Check if user is admin for admin routes
            if (window.location.pathname.startsWith('/admin') && user.role !== 'admin') {
                throw new Error('Unauthorized access. Admin privileges required.');
            }

            // Generate JWT token
            const payload = { 
                userId: user._id,
                email: user.email,
                role: user.role
            };
            const token = jwt.sign(payload, JWT_SECRET);

            return {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                }
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    async verifyEmail(token: string) {
        try {
            const user = await User.findOne({ verificationToken: token });
            if (!user) {
                throw new Error('Invalid verification token');
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();

            return { success: true, message: 'Email verified successfully' };
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    async forgotPassword(email: string) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await user.save();

            // In a real application, you would send this token via email
            console.log('Reset token:', resetToken);

            return { success: true, message: 'Password reset instructions sent to your email' };
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    async resetPassword(token: string, newPassword: string) {
        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                throw new Error('Invalid or expired reset token');
            }

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return { success: true, message: 'Password reset successful' };
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    verifyToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
};