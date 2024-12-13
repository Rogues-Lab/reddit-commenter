import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';

interface RedditComment {
  created_utc: number;
  body: string;
  id: string;
}

interface RedditUserData {
  data: {
    children: Array<{
      data: RedditComment;
    }>;
  };
}

class RedditAPI {
  private readonly baseUrl = 'https://www.reddit.com';
  
  /**
   * Gets the date of the last comment for a specified Reddit user
   * @param username - The Reddit username to check
   * @returns Promise with the date of the last comment or error message
   */
  async getLastCommentDate(username: string): Promise<Date | string> {
    try {
      // Validate username
      if (!username || typeof username !== 'string') {
        throw new Error('Invalid username provided');
      }

      // Make request to Reddit API
      const response = await axios.get<RedditUserData>(
        `${this.baseUrl}/user/${username}/comments.json`,
        {
          headers: {
            'User-Agent': 'Comment-Checker/1.0'
          },
          params: {
            limit: 1,
            sort: 'new'
          }
        }
      );

      // Check if user has any comments
      if (!response.data.data.children.length) {
        return 'No comments found for this user';
      }

      // Get the timestamp of the most recent comment
      const lastCommentTimestamp = response.data.data.children[0].data.created_utc;
      
      // Convert to Date object
      return new Date(lastCommentTimestamp * 1000);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return 'User not found';
        }
        if (error.response?.status === 429) {
          return 'Rate limit exceeded. Please try again later';
        }
        return `API Error: ${error.message}`;
      }
      return `Unexpected error: ${(error as Error).message}`;
    }
  }

  /**
   * Gets additional details about the user's last comment
   * @param username - The Reddit username to check
   * @returns Promise with comment details or error message
   */
  async getLastCommentDetails(username: string): Promise<{
    date: Date;
    body: string;
    commentId: string;
  } | string> {
    try {
      const response = await axios.get<RedditUserData>(
        `${this.baseUrl}/user/${username}/comments.json`,
        {
          headers: {
            'User-Agent': 'Comment-Checker/1.0'
          },
          params: {
            limit: 1,
            sort: 'new'
          }
        }
      );

      if (!response.data.data.children.length) {
        return 'No comments found for this user';
      }

      const comment = response.data.data.children[0].data;
      
      return {
        date: new Date(comment.created_utc * 1000),
        body: comment.body,
        commentId: comment.id
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message}`;
      }
      return `Unexpected error: ${(error as Error).message}`;
    }
  }
}

// Example usage
async function main() {
  const redditAPI = new RedditAPI();

  const readStream = fs.createReadStream('reddit.csv');
  const writeStream = fs.createWriteStream('reddit_out.csv');
  const csvParser = csv();
  let rows: any[] = [];
  csvParser.on('data', (row: any) => {
    rows.push(row);
  });

  csvParser.on('end', async () => {
    for (const row of rows) {
      const { username } = row;
      console.log("processing row", row)
      try {
        const lastCommentDate = await redditAPI.getLastCommentDate(username);
        writeStream.write(`${username},${lastCommentDate}\n`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second (throttled)
      } catch (error) {
        console.error(`Error processing ${username}:`, error);
      }
    }
    console.log('All done!');
  });

  readStream.pipe(csvParser);

}
// Run the script if called directly
if (require.main === module) {
    console.log("starting")
    main()
}

export default RedditAPI;