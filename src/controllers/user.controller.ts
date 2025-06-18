import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getUserRegistrationStats = async (req: Request, res: Response) => {
    try {
        const { period = 'daily' } = req.query; // Can be 'daily', 'weekly', or 'monthly'
        
        const now = new Date();
        let startDate = new Date();
        
        // Set the start date based on the period
        switch(period) {
            case 'weekly':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'monthly':
                startDate.setMonth(now.getMonth() - 1);
                break;
            default: // daily
                startDate.setDate(now.getDate() - 30);
        }

        const registrations = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: period === 'monthly' ? "%Y-%m" : 
                                   period === 'weekly' ? "%Y-%U" : "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Format the response
        const formattedStats = registrations.map(stat => ({
            date: stat._id,
            newUsers: stat.count
        }));

        res.status(200).json({
            success: true,
            data: formattedStats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user registration statistics",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}; 