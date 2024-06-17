// api/rss/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAndUpdateFeed } from '../../lib/newsfeed/helper';

type Article = {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet: string;
};

export async function get(req: NextApiRequest, res: NextApiResponse<Article[] | { message: string }>) {
    try {
        console.log("GET request to /api/rss");
        const articles = await checkAndUpdateFeed();
        res.status(200).json(articles);
    } catch (error) {
        console.error("API call failed:", error);
        res.status(500).json({ message: "Failed to fetch articles" });
    }
}
